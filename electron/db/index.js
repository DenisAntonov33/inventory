const { app } = require("electron");
const fs = require("fs");
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

let _getDatabase;

let userDataFolder;
let folderPath;
let filePath;

const isTest = process.env.NODE_ENV === "test";
console.log("isTest", isTest);

if (!isTest) {
  userDataFolder = app.getPath("userData");
  console.log(userDataFolder);

  folderPath = `${userDataFolder}/database`;
  filePath = `${userDataFolder}/database/data-v0.0.1.json`;
}

async function getDatabase(name, adapter) {
  try {
    if (!_getDatabase) _getDatabase = await createDatabase(name, adapter);
    return _getDatabase;
  } catch (err) {
    throw new Error(err);
  }
}

async function saveDatabase() {
  if (isTest) return;
  try {
    const jsonDB = await _getDatabase.dump();
    fs.writeFileSync(filePath, JSON.stringify(jsonDB, null, 2), "utf-8");
  } catch (err) {
    throw new Error(err);
  }
}

async function removeDatabaseFile() {
  if (isTest) return;
  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    throw new Error(err);
  }
}

async function createDatabase(name, adapter) {
  try {
    const db = await RxDB.create({
      name,
      adapter,
    });

    console.log("creating DB");

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
        throw new Error(err);
      }
    });

    if (isTest) return db;

    const isFolderExist = fs.existsSync(folderPath);
    console.log("isFolderExist", isFolderExist);
    if (!isFolderExist) fs.mkdirSync(folderPath);

    const isFileExist = fs.existsSync(filePath);
    console.log("isFileExist", isFileExist);

    if (!isFileExist) return db;

    const rawdata = fs.readFileSync(filePath);
    db.importDump(JSON.parse(rawdata));

    return db;
  } catch (err) {
    throw new Error(err);
  }
}

exports.getDatabase = getDatabase;
exports.saveDatabase = saveDatabase;
exports.createDatabase = createDatabase;
exports.removeDatabaseFile = removeDatabaseFile;
