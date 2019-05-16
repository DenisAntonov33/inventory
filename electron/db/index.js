const isTest = process.env.NODE_ENV === "test";
let database;

if (!isTest) {
  const { PersistentDatabase } = require("./Persistentdatabase");
  database = new PersistentDatabase();
} else {
  const { Database } = require("./Database");
  database = new Database();
}

exports.database = database;
