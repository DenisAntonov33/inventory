const { getId } = require("../../services/id");
const { normalize } = require("../../utils");

const { Entity } = require("./_Entity_");
const { Entities } = require("./Entities");
const { BodyParams } = require("./BodyParams");
const { BodyValues } = require("./BodyValues");

const {
  BodyValueCollection,
  BodyParamCollection,
  EntityCollection,
} = require("../../db/collections");

const bodyValues = new BodyValues(BodyValueCollection);
const bodyParams = new BodyParams(BodyParamCollection);
const entities = new Entities(EntityCollection);

class Store extends Entity {
  constructor(collection) {
    super(collection);
  }

  async _create(args) {
    try {
      const db = await this.getDatabase();
      const collection = db[this.collection.name];

      const storeEntity = await entities._readById(args.entity);
      if (!storeEntity) throw new Error("invalid entity");

      const storeBodyParam = await bodyParams._readById(
        storeEntity.bodyParam.id
      );
      if (!storeBodyParam) throw new Error("invalid body param");

      const storeBodyValue = storeBodyParam.values.find(
        e => e.id === args.bodyValue
      );
      if (!storeBodyValue) throw new Error("invalid body value");

      const item = await collection.insert({
        id: getId(),
        createdAt: new Date().getTime(),
        entity: storeEntity.id,
        bodyValue: args.bodyValue,
        count: args.count,
      });

      await this.saveDatabase();

      const expandedItem = await this._expand(item);
      return expandedItem;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async _readMany(ids) {
    try {
      const db = await this.getDatabase();
      const collection = db[this.collection.name];
      const items = await collection.find({ id: { $in: ids } }).exec();

      const availableEntities = items.map(e => e.entity);
      const entitiesList = await entities._readMany(availableEntities);

      const availableBodyValues = items.map(e => e.bodyValue);
      const bodyValuesList = await bodyValues._readMany(availableBodyValues);

      const normalizedEntitiesList = normalize(entitiesList);
      const normalizedBodyValuesList = normalize(bodyValuesList);

      const expandedItems = items.map(e => ({
        ...e.toJSON(),
        entity: normalizedEntitiesList[e.entity],
        bodyValue: normalizedBodyValuesList[e.bodyValue],
      }));

      return expandedItems.sort((a, b) => a.createdAt - b.createdAt);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async _expand(item) {
    try {
      const entity = await item.entity_;
      const bodyValue = await item.bodyValue_;

      return {
        ...item.toJSON(),
        entity: entity.toJSON(),
        bodyValue: bodyValue.toJSON(),
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

exports.Store = Store;
