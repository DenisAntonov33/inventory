const { DateTime } = require("luxon");
const { Entity } = require("./_Entity_");
const { Employees } = require("./Employees");
const { History } = require("./History");

const {
  EmployeeCollection,
  HistoryCollection,
} = require("../../db/collections");

const employees = new Employees(EmployeeCollection);
const history = new History(HistoryCollection);

class Requisition extends Entity {
  constructor(collection) {
    super(collection);
    this.defaultMethods = ["create"];
  }

  async create(event, _args) {
    try {
      const { token } = _args;
      const user = await this._authentification(token);
      const expandedUser = user.toJSON();
      const args = {
        availableEmployees: expandedUser.data["employees"],
      };
      const items = await this._create(args);
      event.returnValue = this.res.success({ items });
      return event;
    } catch (err) {
      event.returnValue = this.res.error(500, err.message);
      return event;
    }
  }

  async _create(args) {
    try {
      const { availableEmployees } = args;

      const employeesList = await employees._readMany(availableEmployees);
      const historyList = await history._readMany();

      const data = employeesList.reduce((employeeAcc, employeeCurr) => {
        employeeCurr.positions.forEach(employeePosition => {
          employeePosition.entities.forEach(employeeEntity => {
            const entityBodyParam = employeeEntity.bodyParam;

            const employeeBodyParam = employeeCurr.bodyParams.find(
              e => e.bodyParam.id === entityBodyParam.id
            );

            const employeeBodyValue = employeeBodyParam.bodyValue;

            const lastHistoryItems = historyList
              .filter(
                e =>
                  e.employee === employeeCurr.name &&
                  e.entity === employeeEntity.name &&
                  e.bodyValue === employeeBodyValue.name
              )
              .sort((a, b) => b.date - a.date);

            const currentDate = +DateTime.local().toMillis();
            const isItemHistoryExist =
              lastHistoryItems && lastHistoryItems.length;
            const lastDateOfItemReplacement = isItemHistoryExist
              ? lastHistoryItems[0].date
              : 0;

            const diff = +DateTime.fromMillis(lastDateOfItemReplacement)
              .diffNow("months")
              .months.toFixed(0);

            const replacementPeriod = employeeEntity.replacementPeriod;
            const count = replacementPeriod + diff < 0 ? 1 : 0;

            employeeAcc.push({
              date: currentDate,
              employee: employeeCurr.id,
              positions: employeeCurr.positions.map(e => e.id),
              entity: employeeEntity.id,
              bodyValue: employeeBodyValue.id,
              count,
            });
          });
        });
        return employeeAcc;
      }, []);

      return data;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

exports.Requisition = Requisition;
