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

  async _updateById(id, args) {
    try {
      const db = await this.getDatabase();
      const collection = db[this.collection.name];

      const item = await collection.findOne(id).exec();
      if (!item) return null;

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

      console.log(item.toJSON());

      // if (!item.entities[storeEntity.id]) item.entities[storeEntity.id] = {};
      // await item.save();

      // if (!item.entities[storeEntity.id][storeBodyValue.id])
      //   item.entities[storeEntity.id][storeBodyValue.id] = 0;

      // await item.save();

      await this.saveDatabase();

      const expandedItem = await this._expand(item);
      return expandedItem;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

exports.Store = Store;
