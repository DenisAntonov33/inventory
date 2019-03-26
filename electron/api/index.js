const { ipcMain } = require("electron");
const { login, signup, me } = require("./auth");

const { Entity } = require("./Entity.js");
const {
  BodyValueCollection,
  BodyParamCollection,
  EntityCollection,
  PositionCollection,
  EmployeeCollection,
  HistoryCollection,
} = require("../db/collections");

const entities = [
  new Entity(BodyValueCollection),
  new Entity(BodyParamCollection),
  new Entity(EntityCollection),
  new Entity(PositionCollection),
  new Entity(EmployeeCollection),
  new Entity(HistoryCollection),
];

const methods = ["create", "readById", "readMany", "updateById", "deleteById"];

exports.initApi = function() {
  ipcMain.on("login", login);
  ipcMain.on("signup", signup);
  ipcMain.on("me", me);

  entities.forEach(entity => {
    methods.forEach(method => {
      ipcMain.on(`${entity.collection.link}_${method}`, entity[method]);
    });
  });
};
