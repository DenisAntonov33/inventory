const { Entity } = require("./_Entity_");
const { Employees } = require("./Employees");

const { EmployeeCollection } = require("../../db/collections");

const employees = new Employees(EmployeeCollection);

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
        availablePositions: expandedUser.data["positions"],
        availableEntities: expandedUser.data["entities"],
      };
      const items = await this._create(args);
      event.returnValue = this.res.success({ items });
      return event;
    } catch (err) {
      event.returnValue = this.res.error(500, err.message);
      return event;
    }
  }

  async _create() {
    try {
      const employeesList = await employees._readMany();

      const data = employeesList.reduce((employeeAcc, employeeCurr) => {
        const date = new Date().getTime();

        employeeCurr.positions.forEach(employeePosition => {
          employeePosition.entities.forEach(employeeEntity => {
            const entityBodyParam = employeeEntity.bodyParam;

            const employeeBodyParam = employeeCurr.bodyParams.find(
              e => e.bodyParam.id === entityBodyParam.id
            );

            const employeeBodyValue = employeeBodyParam.bodyValue;

            employeeAcc.push({
              date,
              employee: employeeCurr.id,
              positions: employeeCurr.positions.map(e => e.id),
              entity: employeeEntity.id,
              bodyValue: employeeBodyValue.id,
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
