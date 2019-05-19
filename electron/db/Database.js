const { cloneDeep } = require("lodash");
const RxDB = require("rxdb");
RxDB.plugin(require("pouchdb-adapter-memory"));

const collections = require("./collections");

const BodyValueCollection = collections["BodyValueCollection"];
const BodyParamCollection = collections["BodyParamCollection"];
const EntityCollection = collections["EntityCollection"];
const PositionCollection = collections["PositionCollection"];
const EmployeeCollection = collections["EmployeeCollection"];
const HistoryCollection = collections["HistoryCollection"];
const StoreCollection = collections["StoreCollection"];
const UserCollection = collections["UserCollection"];

class Database {
  constructor() {
    this.instance = null;
  }

  async getInstance(name) {
    try {
      if (!this.instance) this.instance = await this._createInstance(name);
      return this.instance;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async createInstance(name) {
    try {
      this.instance = await this._createInstance(name);
      return this.instance;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async _withCollections(db) {
    try {
      await db.collection(cloneDeep(BodyValueCollection));
      await db.collection(cloneDeep(BodyParamCollection));
      await db.collection(cloneDeep(EntityCollection));
      await db.collection(cloneDeep(PositionCollection));
      await db.collection(cloneDeep(EmployeeCollection));
      await db.collection(cloneDeep(HistoryCollection));
      await db.collection(cloneDeep(StoreCollection));

      const userCollection = await db.collection({ ...UserCollection });
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

      return await this._withCollections(db);
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
