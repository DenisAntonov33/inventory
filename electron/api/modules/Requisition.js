const { DateTime } = require("luxon");
const { Factory } = require("./_Factory_");

class Requisition extends Factory {
  constructor(args) {
    super(args);

    this.defaultMethods = ["create"];

    const {
      items: { employees, history },
    } = args;

    if (!employees) throw new Error("employees instance required");
    if (!history) throw new Error("history instance required");

    this.employees = employees;
    this.history = history;
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

      const employeesList = await this.employees._readMany(availableEmployees);
      const historyList = await this.history._readMany();

      const data = employeesList.reduce((employeeAcc, employeeCurr) => {
        employeeCurr.positions.forEach(employeePosition => {
          for (let employeeEntity of employeePosition.entities) {
            const entityBodyParam = employeeEntity.bodyParam;

            let employeeBodyParam = null;

            if (entityBodyParam)
              employeeBodyParam = employeeCurr.bodyParams.find(
                e => e.bodyParam.id === entityBodyParam.id
              );

            if (entityBodyParam && !employeeBodyParam) continue;

            const employeeBodyValue = employeeBodyParam
              ? employeeBodyParam.bodyValue
              : null;

            const lastHistoryItems = historyList
              .filter(
                e =>
                  e.employee === employeeCurr.id &&
                  e.entity === employeeEntity.id &&
                  (entityBodyParam
                    ? e.bodyValue === employeeBodyValue.id
                    : true)
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
              ...(employeeBodyValue ? { bodyValue: employeeBodyValue.id } : {}),
              count,
            });
          }
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
