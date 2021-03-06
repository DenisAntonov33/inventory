const { intersection: _intersection } = require("lodash");
const { res } = require("../../../services/response");
const { database } = require("../../../db/index");
const { getId } = require("../../../services/id");
const { tokenService } = require("../../../services/token");
const { UserCollection } = require("../../../db/collections");

class Entity {
  constructor(collection) {
    this.getDatabase = database.getInstance.bind(database);
    this.saveDatabase = database.save.bind(database);
    this.collection = collection;
    this.userCollection = UserCollection;
    this.res = res;

    this.defaultMethods = [
      "create",
      "readById",
      "readMany",
      "updateById",
      "deleteById",
    ];
  }

  getMethods() {
    return this.defaultMethods;
  }

  async _authentification(token) {
    try {
      if (!token) throw new Error("Token is required");
      const { id } = tokenService.verify(token);

      const db = await this.getDatabase();
      const collection = db[this.userCollection.name];
      const user = await collection.findOne(id).exec();

      if (!user) throw new Error("User not found");

      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async _authorization(user, ids) {
    try {
      const _user = user.toJSON();
      const availableIds = _user.data[this.collection.link];

      const item = ids.forEach(e => {
        if (!availableIds.includes(e)) throw new Error("Forbidden");
      });

      return item;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async create(event, _args) {
    try {
      const { token, args } = _args;
      const user = await this._authentification(token);
      const item = await this._create(args);

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

  async readById(event, _args) {
    try {
      const { token, id } = _args;
      if (!id) throw new Error("Id required");

      const user = await this._authentification(token);
      await this._authorization(user, id ? [id] : []);

      const item = await this._readById(id);
      event.returnValue = this.res.success({ item });
      return event;
    } catch (err) {
      event.returnValue = this.res.error(500, err.message);
      return event;
    }
  }

  async readMany(event, _args) {
    try {
      const { token, ids, args } = _args;

      const user = await this._authentification(token);
      const _user = user.toJSON();
      await this._authorization(user, ids || []);

      const userIds = _user.data[this.collection.link];
      const availableIds = ids ? _intersection(userIds, ids) : userIds;

      const items = await this._readMany(availableIds, args || {});
      event.returnValue = this.res.success({ items });
      return event;
    } catch (err) {
      event.returnValue = this.res.error(500, err.message);
      return event;
    }
  }

  async updateById(event, _args) {
    try {
      const { token, id, args } = _args;
      if (!id) throw new Error("Id required");

      const user = await this._authentification(token);

      const ids = id ? [id] : [];
      await this._authorization(user, ids);

      const item = await this._updateById(id, args);
      if (!item) throw new Error("Item not found");

      event.returnValue = this.res.success({ item });
      return event;
    } catch (err) {
      event.returnValue = this.res.error(500, err.message);
      return event;
    }
  }

  async deleteById(event, _args) {
    try {
      const { token, id } = _args;
      if (!id) throw new Error("Id required");

      const user = await this._authentification(token);

      const ids = id ? [id] : [];
      await this._authorization(user, ids);

      const item = await this._deleteById(id);
      if (!item) throw new Error("Item not found");

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

      const item = await collection.insert({
        id: getId(),
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        ...args,
      });

      await this.saveDatabase();

      const expandedItem = await this._expand(item);
      return expandedItem;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async _readMany(ids, args = {}) {
    try {
      const db = await this.getDatabase();
      const collection = db[this.collection.name];
      const items = await collection.find({ id: { $in: ids }, ...args }).exec();

      const expandedItems = await this._expandList(items);
      return expandedItems;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async _readById(id) {
    try {
      const db = await this.getDatabase();
      const collection = db[this.collection.name];
      const item = await collection.findOne(id).exec();
      if (!item) return null;

      const expandedItem = await this._expand(item);
      return expandedItem;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async _updateById(id, args) {
    try {
      const db = await this.getDatabase();
      const collection = db[this.collection.name];
      const item = await collection.findOne(id).exec();
      if (!item) return null;

      const _args = await this._argsHandler(args);

      await item.update({
        ..._args,
        $set: {
          updatedAt: new Date().getTime(),
          ...(_args.$set || {}),
        },
      });

      await this.saveDatabase();

      const expandedItem = await this._expand(item);

      return expandedItem;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async _deleteById(id) {
    try {
      const db = await this.getDatabase();
      const collection = db[this.collection.name];
      const item = await collection.findOne(id).exec();
      if (!item) return null;

      await item.remove();
      await this.saveDatabase();

      return item.toJSON();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async _expand(item) {
    try {
      return item.toJSON();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async _expandList(items) {
    try {
      return items
        .map(e => e.toJSON())
        .sort((a, b) => a.createdAt - b.createdAt);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async _argsHandler(args) {
    try {
      return args;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

exports.Entity = Entity;
