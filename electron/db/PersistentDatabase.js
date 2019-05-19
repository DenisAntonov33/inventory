const { app } = require("electron");
const fs = require("fs");
const { Database } = require("./Database");

const isDev = process.env.NODE_ENV === "development";
const dbName = "data-v0.0.1";

const userDataFolder = app.getPath("userData");
const folderPath = `${userDataFolder}/database`;
const fileName = isDev ? `${dbName}-dev.json` : `${dbName}.json`;
const filePath = `${folderPath}/${fileName}`;

class PersistentDatabase extends Database {
  constructor() {
    super();
  }

  async createInstance(name) {
    try {
      this.instance = await this._createInstance(name);
      await this.import();

      return this.instance;
    } catch (err) {
      throw new Error(err);
    }
  }

  async save() {
    try {
      const jsonedDB = await this.instance.dump();
      fs.writeFileSync(filePath, JSON.stringify(jsonedDB, null, 2), "utf-8");
    } catch (err) {
      throw new Error(err);
    }
  }

  async import() {
    try {
      const isFolderExist = fs.existsSync(folderPath);
      if (!isFolderExist) fs.mkdirSync(folderPath);
      console.log("isFolderExist", isFolderExist);

      const isFileExist = fs.existsSync(filePath);
      console.log("isFileExist", isFileExist);

      if (!isFileExist) return;

      const rawdata = fs.readFileSync(filePath);
      await this.load(JSON.parse(rawdata));
    } catch (err) {
      throw new Error(err);
    }
  }
}

exports.PersistentDatabase = PersistentDatabase;
