const { normalize } = require("../../utils");

const { Factory } = require("./_Factory_");

class Store extends Factory {
  constructor(args) {
    super(args);

    const {
      items: { entities, bodyValues },
    } = args;

    if (!entities) throw new Error("entities instance required");
    if (!bodyValues) throw new Error("bodyValues instance required");

    this.entities = entities;
    this.bodyValues = bodyValues;
  }
  async create(event, _args) {
    try {
      const { token, args } = _args;
      const user = await this._authentification(token);

      const id = `${args.entity}_${args.bodyValue}_id`;
      const isItemExist = !!user.data[this.collection.link].find(
        e => e.id === id
      );

      const item = isItemExist
        ? await this._updateById(id, { $inc: { count: args.count } })
        : await this._create(args);

      const changeFunction = oldData => {
        oldData.data[this.collection.link] = [
          ...oldData.data[this.collection.link],
          item.id,
        ];
        return oldData;
      };

      await user.atomicUpdate(changeFunction);
      await this.saveDatabase();

      event.returnValue = this.res.success({ item });
      return event;
    } catch (err) {
      event.returnValue = this.res.error(500, err.message);
      return event;
    }
  }

  async _create(args) {
    try {
      const db = await this.getDatabase();
      const collection = db[this.collection.name];

      const storeEntity = await this.entities._readById(args.entity);
      if (!storeEntity) throw new Error("invalid entity");

      const storeBodyParam = storeEntity.bodyParam;
      if (!storeBodyParam) throw new Error("invalid body param");

      const storeBodyValue = storeBodyParam.values.find(
        e => e.id === args.bodyValue
      );
      if (!storeBodyValue) throw new Error("invalid body value");

      const item = await collection.insert({
        id: `${storeEntity.id}_${storeBodyValue.id}_id`,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
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

  async _expandList(items) {
    try {
      const availableEntities = items.map(e => e.entity);
      const entitiesList = await this.entities._readMany(availableEntities);

      const availableBodyValues = items.map(e => e.bodyValue);
      const bodyValuesList = await this.bodyValues._readMany(
        availableBodyValues
      );

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
      const entity = await this.entities._readById(item.entity);
      const bodyValue = entity.bodyParam.values.find(
        e => e.id === item.bodyValue
      );

      return {
        ...item.toJSON(),
        entity: entity,
        bodyValue: bodyValue,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

exports.Store = Store;
