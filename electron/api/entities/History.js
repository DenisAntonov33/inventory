const { getId } = require("../../services/id");
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
    this.defaultMethods = ["create", "readMany", "deleteById"];
  }

  async _create(args) {
    try {
      const db = await this.getDatabase();
      const collection = db[this.collection.name];

      const historyPositions = await positions._readMany(args.positions);
      if (!historyPositions.length) throw new Error("invalid positions");

      const historyEmployee = await employees._readById(args.employee);
      if (!historyEmployee) throw new Error("invalid employee");

      const historyEntity = await entities._readById(args.entity);
      if (!historyEntity) throw new Error("invalid entity");

      const historyBodyParam = await bodyParams._readById(
        historyEntity.bodyParam.id
      );
      if (!historyBodyParam) throw new Error("invalid body param");

      const historyBodyValue = historyBodyParam.values.find(
        e => e.id === args.bodyValue
      );
      if (!historyBodyValue) throw new Error("invalid body value");

      const item = await collection.insert({
        id: getId(),
        createdAt: new Date().getTime(),
        date: "1",
        positions: historyPositions.map(e => e.name),
        employee: historyEmployee.name,
        entity: historyEntity.name,
        bodyValue: historyBodyValue.name,
      });

      await this.saveDatabase();
      return item ? item.toJSON() : null;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

exports.History = History;
