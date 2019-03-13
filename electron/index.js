const { app, BrowserWindow } = require("electron");
const path = require("path");

const { initApi } = require("./api");
const { initDatabase } = require("./db");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  const isDev = process.env.NODE_ENV === "development";

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // if (isDev) mainWindow.webContents.openDevTools();
  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}

app.on("ready", () => {
  initDatabase(function() {
    initApi();
    createWindow();
  });
});

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow();
  }
});
