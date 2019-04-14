const { getId } = require("../../services/id");
const { normalize } = require("../../utils");

const { Entity } = require("./_Entity_");
const { Entities } = require("./Entities");
const { BodyParams } = require("./BodyParams");
const { Positions } = require("./Positions");
const { Employees } = require("./Employees");

const {
  BodyParamCollection,
  EntityCollection,
  PositionCollection,
  EmployeeCollection,
} = require("../../db/collections");

const entities = new Entities(EntityCollection);
const bodyParams = new BodyParams(BodyParamCollection);
const positions = new Positions(PositionCollection);
const employees = new Employees(EmployeeCollection);

class History extends Entity {
  constructor(collection) {
    super(collection);
    this.defaultMethods = ["create", "readMany", "updateMany", "deleteById"];
  }

  async _create(args) {
    try {
      const db = await this.getDatabase();
      const collection = db[this.collection.name];

      const data = args.list.reduce(
        (acc, curr) => {
          if (!curr.employee) throw new Error("employee required");
          if (!curr.positions || !curr.positions.length)
            throw new Error("positions required");
          if (!curr.entity) throw new Error(" entity required");
          if (!curr.bodyValue) throw new Error("bodyValue required");

          acc.employees.push(curr.employee);
          acc.positions = [...acc.positions, ...curr.positions];
          acc.entities.push(curr.entity);
          return acc;
        },
        {
          employees: [],
          positions: [],
          entities: [],
        }
      );
      const employeesList = await employees._readMany(data.employees);
      const positionsList = await positions._readMany(data.positions);

      const availableEntities = positionsList.reduce(
        (acc, curr) => [...acc, ...curr.entities],
        []
      );
      const entitiesList = await entities._readMany(availableEntities);

      const availableBodyParams = entitiesList.map(e => e.bodyParam);
      const bodyParamsList = await bodyParams._readMany(availableBodyParams);

      const availableBodyValues = bodyParamsList.reduce(
        (acc, curr) => [...acc, ...curr.values],
        []
      );

      const normalizedEmployeesList = normalize(employeesList);
      const normalizedPositionsList = normalize(positionsList);
      const normalizedEntitiesList = normalize(entitiesList);
      const normalizedBodyValuesList = normalize(availableBodyValues);

      const list = args.list.map(e => {
        const employee = normalizedEmployeesList[e.employee];
        if (!employee) throw new Error("invalid employee");

        const positions = e.positions.map(
          position => normalizedPositionsList[position]
        );
        if (!positions.length) throw new Error("invalid positions");

        const entity = normalizedEntitiesList[e.entity];
        if (!entity) throw new Error("invalid entity");

        const bodyValue = normalizedBodyValuesList[e.bodyValue];
        if (!bodyValue) throw new Error("invalid bodyValue");

        return {
          employee: employee.name,
          positions: positions.name,
          entity: entity.name,
          bodyValue: bodyValue.name,
        };
      });

      const item = await collection.insert({
        id: getId(),
        createdAt: new Date().getTime(),
        date: args.date,
        list,
      });

      await this.saveDatabase();
      return item ? item.toJSON() : null;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

exports.History = History;
