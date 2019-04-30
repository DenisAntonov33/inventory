const { getId } = require("../../services/id");
const { normalize } = require("../../utils");

const { Entity } = require("./_Entity_");
const { Employees } = require("./Employees");
const { Store } = require("./Store");

const { EmployeeCollection, StoreCollection } = require("../../db/collections");

const employees = new Employees(EmployeeCollection);
const store = new Store(StoreCollection);

class History extends Entity {
  constructor(collection) {
    super(collection);
  }

  async _create(args) {
    try {
      const db = await this.getDatabase();
      const collection = db[this.collection.name];

      if (!args.date) throw new Error("date required");
      if (!args.employee) throw new Error("employee required");
      if (typeof args.count !== "number") throw new Error("count required");
      if (!args.count) throw new Error("count shoud be more than 0");
      if (!args.positions || !args.positions.length)
        throw new Error("positions required");
      if (!args.entity) throw new Error(" entity required");
      if (!args.bodyValue) throw new Error("bodyValue required");

      const employeeItem = await employees._readById(args.employee);
      const positionsList = employeeItem.positions;
      const entitiesList = positionsList.reduce(
        (acc, curr) => [...acc, ...curr.entities],
        []
      );

      const bodyParamsList = entitiesList.map(e => e.bodyParam);
      const bodyValuesList = bodyParamsList.reduce(
        (acc, curr) => [...acc, ...curr.values],
        []
      );

      const normalizedPositionsList = normalize(positionsList);
      const normalizedEntitiesList = normalize(entitiesList);
      const normalizedBodyValuesList = normalize(bodyValuesList);

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

      const storeCollection = db[store.collection.name];
      const storeItem = await storeCollection
        .findOne({
          $and: [
            { entity: { $eq: _entity.id } },
            { bodyValue: { $eq: _bodyValue.id } },
          ],
        })
        .exec();

      if (!storeItem) throw new Error("item is unavailable in store");
      if (!storeItem.count) throw new Error("store is empty");
      if (storeItem.count - args.count < 0) throw new Error("out of store");

      await store._updateById(storeItem.id, {
        $inc: { count: -args.count },
      });

      const item = await collection.insert({
        id: getId(),
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        date: args.date,
        employee: _employee.name,
        positions: _positions,
        entity: _entity.name,
        bodyValue: _bodyValue.name,
        count: args.count,
      });

      await this.saveDatabase();

      const expandedItem = await this._expand(item);
      return expandedItem;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

exports.History = History;
