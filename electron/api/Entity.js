const { res } = require("../services/response");
const { getDatabase, saveDatabase } = require("../db/index");
const { getId } = require("../services/id");

class Entity {
  constructor(collection) {
    this.collection = collection;
  }

  async create(event, args) {
    try {
      const db = await getDatabase();
      const collection = db[this.collection.name];

      const item = await collection.insert({
        id: getId(),
        ...args,
      });

      await saveDatabase();

      event.returnValue = res.success({ item: item.toJSON() });
      return event;
    } catch (err) {
      event.returnValue = res.error(500, err.message);
      return event;
    }
  }

  async readAll(event) {
    try {
      const db = await getDatabase();
      const collection = db[this.collection.name];

      const items = await collection.find().exec();

      event.returnValue = res.success({ items: items.map(e => e.toJSON()) });
      return event;
    } catch (err) {
      event.returnValue = res.error(500, err.message);
      return event;
    }
  }

  async readById(event, id) {
    try {
      const db = await getDatabase();
      const collection = db[this.collection.name];
      const item = await collection
        .findOne()
        .where("id")
        .eq(id)
        .exec();

      event.returnValue = res.success({ item });
      return event;
    } catch (err) {
      event.returnValue = res.error(500, err.message);
      return event;
    }
  }

  async updateById(event, id, args) {
    try {
      const db = await getDatabase();
      const collection = db[this.collection.name];
      const item = await collection.findOne(id).exec();

      await item.update({
        $set: { ...args },
      });

      await saveDatabase();

      event.returnValue = res.success({ item: item.toJSON() });
      return event;
    } catch (err) {
      event.returnValue = res.error(500, err.message);
      return event;
    }
  }

  async deleteById(event, id) {
    try {
      const db = await getDatabase();
      const collection = db[this.collection.name];
      const item = await collection
        .findOne()
        .where("id")
        .eq(id)
        .exec();

      await item.remove();

      event.returnValue = res.success();
      return event;
    } catch (err) {
      event.returnValue = res.error(500, err.message);
      return event;
    }
  }
}

exports.Entity = Entity;
