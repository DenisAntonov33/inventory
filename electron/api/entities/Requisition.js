const { normalize } = require("../../utils");

const { Entity } = require("./_Entity_");
const { Entities } = require("./Entities");
const { Positions } = require("./Positions");
const { Employees } = require("./Employees");

const {
  EntityCollection,
  PositionCollection,
  EmployeeCollection,
} = require("../../db/collections");

const entities = new Entities(EntityCollection);
const positions = new Positions(PositionCollection);
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

      const availablePositions = employeesList.reduce(
        (acc, curr) => [...acc, ...curr.positions],
        []
      );
      const positionsList = await positions._readMany(availablePositions);

      const availableEntities = positionsList.reduce(
        (acc, curr) => [...acc, ...curr.entities],
        []
      );
      const entitiesList = await entities._readMany(availableEntities);

      const normalizedPositionsList = normalize(positionsList);
      const normalizedEntitiesList = normalize(entitiesList);

      const data = employeesList.reduce((employeeAcc, employeeCurr) => {
        const date = new Date().getTime();

        employeeCurr.positions.forEach(employeePosition => {
          normalizedPositionsList[employeePosition].entities.forEach(
            employeeEntityId => {
              const entityBodyParamId =
                normalizedEntitiesList[employeeEntityId].bodyParam;

              const employeeBodyParam = employeeCurr.bodyParams.find(
                e => e.bodyParam === entityBodyParamId
              );

              const employeeBodyValueId = employeeBodyParam.bodyValue;

              employeeAcc.push({
                date,
                employee: employeeCurr.id,
                positions: employeeCurr.positions,
                entity: employeeEntityId,
                bodyValue: employeeBodyValueId,
              });
            }
          );
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
