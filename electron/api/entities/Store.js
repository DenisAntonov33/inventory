const { getId } = require("../../services/id");
const { Entity } = require("./_Entity_");

const { Entities } = require("./Entities");
const { BodyParams } = require("./BodyParams");

const {
  BodyParamCollection,
  EntityCollection,
} = require("../../db/collections");

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
        bodyValue: storeBodyValue.id,
        count: args.count,
      });

      await this.saveDatabase();

      const expandedItem = await this._expand(item);
      return expandedItem;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async _expand(item) {
    try {
      const entity = await item.entity_;
      const bodyParam = await bodyParams._readById(entity.toJSON().bodyParam);
      const bodyValue = await item.bodyValue_;

      return {
        ...item.toJSON(),
        entity: {
          ...entity.toJSON(),
          bodyParam,
        },
        bodyValue: bodyValue.toJSON(),
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

exports.Store = Store;
