const { ipcMain } = require("electron");
const { login, signup } = require("./auth");

exports.initApi = function() {
  ipcMain.on("login", login);
  ipcMain.on("signup", signup);
};
