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

      if (!args.date) throw new Error("date required");
      if (!args.employee) throw new Error("employee required");
      if (!args.positions || !args.positions.length)
        throw new Error("positions required");
      if (!args.entity) throw new Error(" entity required");
      if (!args.bodyValue) throw new Error("bodyValue required");

      const employeeItem = await employees._readById(args.employee);
      const positionsList = await positions._readMany(args.positions);

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

      const normalizedPositionsList = normalize(positionsList);
      const normalizedEntitiesList = normalize(entitiesList);
      const normalizedBodyValuesList = normalize(availableBodyValues);

      const _employee = employeeItem;
      if (!_employee) throw new Error("invalid employee");

      const _positions = args.positions.map(
        position => normalizedPositionsList[position].name
      );
      if (!_positions.length) throw new Error("invalid positions");

      const _entity = normalizedEntitiesList[args.entity];
      if (!_entity) throw new Error("invalid entity");

      const _bodyValue = normalizedBodyValuesList[args.bodyValue];
      if (!_bodyValue) throw new Error("invalid bodyValue");

      const storeRelease = {
        entity: _entity.id,
        bodyValue: _bodyValue.id,
      };

      console.log(storeRelease);

      const item = await collection.insert({
        id: getId(),
        createdAt: new Date().getTime(),
        date: args.date,
        employee: _employee.name,
        positions: _positions,
        entity: _entity.name,
        bodyValue: _bodyValue.name,
      });

      await this.saveDatabase();
      return item ? item.toJSON() : null;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

exports.History = History;
