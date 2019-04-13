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
    this.defaultMethods = ["create", "readMany", "updateMany", "deleteById"];
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

  async updateMany(event, _args) {
    try {
      const { token, ids, args } = _args;
      if (!ids || !ids.length) throw new Error("Id required");

      const user = await this._authentification(token);
      await this._authorization(user, ids);

      const items = await this._updateMany(ids, args);

      event.returnValue = this.res.success({ items });
      return event;
    } catch (err) {
      event.returnValue = this.res.error(500, err.message);
      return event;
    }
  }

  async _updateMany(ids, args) {
    try {
      const db = await this.getDatabase();
      const collection = db[this.collection.name];

      const items = await collection.find({ id: { $in: ids } }).exec();
      if (!items.length) return null;

      const _args = await this._argsHandler(args);

      await items.update(_args);
      await this.saveDatabase();

      return items
        .map(e => e.toJSON())
        .sort((a, b) => a.createdAt - b.createdAt);
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

exports.History = History;
