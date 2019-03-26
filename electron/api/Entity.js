const { res } = require("../services/response");
const { getDatabase, saveDatabase } = require("../db/index");
const { getId } = require("../services/id");
const { tokenService } = require("../services/token");
const { UserCollection } = require("../db/collections");

class Entity {
  constructor(collection) {
    this.collection = collection;
  }

  async _authentification(token) {
    try {
      if (!token) throw new Error("Token is required");
      const { id } = tokenService.verify(token);

      const db = await getDatabase();
      const collection = db[UserCollection.name];

      const user = await collection
        .findOne()
        .where("id")
        .eq(id)
        .exec();

      if (!user) throw new Error("User not found");

      return user;
    } catch (err) {
      throw new Error(err);
    }
  }

  async _authorization(user, resourceId) {
    try {
      const _user = user.toJSON();
      const item = _user[this.collection.link].find(e => e.id === resourceId);
      if (!item) throw new Error("Forbidden");

      return item;
    } catch (err) {
      throw new Error(err);
    }
  }

  async create(event, token, args) {
    try {
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

      event.returnValue = res.success({ item });
      return event;
    } catch (err) {
      event.returnValue = res.error(500, err.message);
      return event;
    }
  }

  async readById(event, token, id) {
    try {
      const user = await this._authentification(token);
      await this._authorization(user, id);

      const item = await this._readById(id);
      event.returnValue = res.success({ item });
      return event;
    } catch (err) {
      event.returnValue = res.error(500, err.message);
      return event;
    }
  }

  async readMany(event, token, args) {
    try {
      const user = await this._authentification(token);
      const _user = user.toJSON();
      const availableIds = _user[this.collection.link];

      const items = await this._readMany(availableIds, args);
      event.returnValue = res.success({ items });
      return event;
    } catch (err) {
      event.returnValue = res.error(500, err.message);
      return event;
    }
  }

  async updateById(event, token, id, args) {
    try {
      const user = await this._authentification(token);
      await this._authorization(user, id);

      const item = await this._updateById(id, args);
      event.returnValue = res.success({ item });
      return event;
    } catch (err) {
      event.returnValue = res.error(500, err.message);
      return event;
    }
  }

  async deleteById(event, token, id) {
    try {
      const user = await this._authentification(token);
      await this._authorization(user, id);

      await this._deleteById(id);

      event.returnValue = res.success({});
      return event;
    } catch (err) {
      event.returnValue = res.error(500, err.message);
      return event;
    }
  }

  async _create(args) {
    try {
      const db = await getDatabase();
      const collection = db[this.collection.name];

      const item = await collection.insert({
        id: getId(),
        ...args,
      });

      await saveDatabase();
      return item.toJSON();
    } catch (err) {
      throw new Error(err);
    }
  }

  async _readMany(availableIds, args) {
    try {
      const db = await getDatabase();
      const collection = db[this.collection.name];

      const items = await collection
        .find(availableIds)
        .find(args)
        .exec();
      return items.map(e => e.toJSON());
    } catch (err) {
      throw new Error(err);
    }
  }

  async _readById(id) {
    try {
      if (!id) throw new Error("Id required");

      const db = await getDatabase();
      const collection = db[this.collection.name];
      const item = await collection
        .findOne()
        .where("id")
        .eq(id)
        .exec();

      if (!item) throw new Error("Item not found");
      return item.toJSON();
    } catch (err) {
      throw new Error(err);
    }
  }

  async _updateById(id, args) {
    try {
      if (!id) throw new Error("Id required");

      const db = await getDatabase();
      const collection = db[this.collection.name];
      const item = await collection.findOne(id).exec();

      if (!item) throw new Error("Item not found");

      await item.update({
        $set: { ...args },
      });

      await saveDatabase();
      return item.toJSON();
    } catch (err) {
      throw new Error(err);
    }
  }

  async _deleteById(id) {
    try {
      if (!id) throw new Error("Id required");

      const db = await getDatabase();
      const collection = db[this.collection.name];
      const item = await collection
        .findOne()
        .where("id")
        .eq(id)
        .exec();

      if (!item) throw new Error("Item not found");

      await item.remove();
      return true;
    } catch (err) {
      throw new Error(err);
    }
  }
}

exports.Entity = Entity;
