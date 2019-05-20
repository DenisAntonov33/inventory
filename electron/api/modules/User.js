const { res } = require("../../services/response");
const { tokenService } = require("../../services/token");

class User {
  constructor({ collection, db }) {
    this.getDatabase = db.getInstance.bind(db);
    this.saveDatabase = db.save.bind(db);
    this.collection = collection;
    this.res = res;

    this.methods = ["update"];
  }

  getMethods() {
    return this.methods;
  }

  async _authentification(token) {
    try {
      if (!token) throw new Error("Token is required");
      const { id } = tokenService.verify(token);

      const db = await this.getDatabase();
      const collection = db[this.collection.name];
      const user = await collection.findOne(id).exec();

      if (!user) throw new Error("User not found");

      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async update(event, _args) {
    try {
      const { token, args } = _args;

      const {
        $set: { name, fullName, area, personalNumber },
      } = args;

      if (!name) throw new Error("name required");
      if (name && !name.length) throw new Error("name required");

      const user = await this._authentification(token);

      const item = await this._updateById(user.id, {
        $set: {
          name,
          fullName,
          area,
          personalNumber,
        },
      });

      if (!item) throw new Error("Item not found");

      const filteredItem = {
        name: item.name,
        fullName: item.fullName,
        area: item.area,
        personalNumber: item.personalNumber,
      };

      event.returnValue = this.res.success({ item: filteredItem });
      return event;
    } catch (err) {
      event.returnValue = this.res.error(500, err.message);
      return event;
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

  async _expand(item) {
    try {
      return item.toJSON();
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

exports.User = User;
