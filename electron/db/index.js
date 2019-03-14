const { app } = require("electron");
const loki = require("lokijs");
const fs = require("fs");

let db = null;
const collections = [
  { name: "users", params: { unique: ["id", "username"], autoupdate: true } }
];

function createCollection(collection, db) {
  const { name, params } = collection;
  const entries = db.getCollection(name);
  if (entries === null) db.addCollection(name, { ...params });
}

function initCollections(db) {
  collections.forEach(e => createCollection(e, db));
}

exports.getInstance = function() {
  if (!db) throw new Error("DB is not defined");
  return db;
};

exports.initDatabase = function(callback) {
  const userDataFolder = app.getPath("userData");
  console.log(userDataFolder);
  const folderPath = `${userDataFolder}/database`;
  const filePath = `${userDataFolder}/database/data.json`;

  try {
    const isFolderExist = fs.existsSync(folderPath);
    console.log("isFolderExist", isFolderExist);
    if (!isFolderExist) fs.mkdirSync(folderPath);

    const isFileExist = fs.existsSync(filePath);
    console.log("isFileExist", isFileExist);
    if (!isFileExist) fs.writeFileSync(filePath, "", "utf-8");
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }

  db = new loki(filePath, {
    autoload: true,
    autoloadCallback: databaseInitialize,
    autosave: true,
    autosaveInterval: 4000
  });

  function databaseInitialize() {
    console.log("DB is Inited");
    initCollections(db);
    callback();
  }
};

exports.initTestDatabase = function(callback) {
  console.log("testDatabase initialized");
  db = new loki();
  initCollections(db);
};
