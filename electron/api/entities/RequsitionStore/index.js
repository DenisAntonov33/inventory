const { Entity } = require("../_Entity_");
const { Employees } = require("../Employees");

const { EmployeeCollection } = require("../../../db/collections");

const employees = new Employees(EmployeeCollection);

class RequisitionStore extends Entity {
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

      const data = employeesList.reduce((employeeAcc, employeeCurr) => {
        console.log(employeeCurr);
        return employeeAcc;
      }, []);

      return data;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

exports.RequisitionStore = RequisitionStore;
