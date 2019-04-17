const { ipcMain } = require("electron");
const { login, signup, me } = require("./auth");

const { BodyValues } = require("./BodyValues");
const { BodyParams } = require("./BodyParams");
const { Entities } = require("./Entities");
const { Positions } = require("./Positions");
const { Employees } = require("./Employees");
const { History } = require("./History");
const { Store } = require("./Store");

const {
  BodyValueCollection,
  BodyParamCollection,
  EntityCollection,
  PositionCollection,
  EmployeeCollection,
  HistoryCollection,
  StoreCollection,
} = require("../db/collections");

const entities = [
  new BodyValues(BodyValueCollection),
  new BodyParams(BodyParamCollection),
  new Entities(EntityCollection),
  new Positions(PositionCollection),
  new Employees(EmployeeCollection),
  new History(HistoryCollection),
  new Store(StoreCollection),
];

exports.initApi = function() {
  ipcMain.on("login", login);
  ipcMain.on("signup", signup);
  ipcMain.on("me", me);

  entities.forEach(entity => {
    const methods = entity.getMethods();

    methods.forEach(method => {
      ipcMain.on(
        `${entity.collection.link}_${method}`,
        entity[method].bind(entity)
      );
    });
  });
};
