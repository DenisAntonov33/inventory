const RxDB = require("rxdb");
RxDB.plugin(require("pouchdb-adapter-memory"));

const {
  BodyValueCollection,
  BodyParamCollection,
  EntityCollection,
  PositionCollection,
  EmployeeCollection,
  HistoryCollection,
  StoreCollection,
  UserCollection,
} = require("./collections");

class Database {
  constructor() {
    this.instance = null;
  }

  async getInstance(name) {
    try {
      if (!this.instance) await this._createInstance(name);
      return this.instance;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async createInstance(name) {
    try {
      await this._createInstance(name);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async _withCollections(db) {
    try {
      await db.collection(BodyValueCollection);
      await db.collection(BodyParamCollection);
      await db.collection(EntityCollection);
      await db.collection(PositionCollection);
      await db.collection(EmployeeCollection);
      await db.collection(HistoryCollection);
      await db.collection(StoreCollection);

      const userCollection = await db.collection(UserCollection);
      userCollection.preInsert(async plainData => {
        try {
          const { name } = plainData;

          const user = await userCollection
            .findOne()
            .where("name")
            .eq(name)
            .exec();

          if (user) throw new Error("Duplicate key for property username");
        } catch (err) {
          throw new Error(err.message);
        }
      });

      return db;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async _createInstance(name) {
    try {
      const db = await RxDB.create({
        name,
        adapter: "memory",
      });

      this.instance = await this._withCollections(db);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async load(data) {
    try {
      await this.instance.importDump(data);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async save() {}
}

exports.Database = Database;
