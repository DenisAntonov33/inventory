const { ipcMain } = require("electron");
const { login, signup, me } = require("./auth");

const { BodyValues } = require("./entities/BodyValues");
const { BodyParams } = require("./entities/BodyParams");
const { Entities } = require("./entities/Entities");
const { Positions } = require("./entities/Positions");
const { Employees } = require("./entities/Employees");
const { History } = require("./entities/History");
const { Store } = require("./entities/Store");
const { Requisition } = require("./entities/Requisition");

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

const requisition = new Requisition();

exports.initApi = function() {
  ipcMain.on("login", login);
  ipcMain.on("signup", signup);
  ipcMain.on("me", me);
  ipcMain.on("requisition_create", requisition.create.bind(requisition));

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
