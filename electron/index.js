const { app, BrowserWindow } = require("electron");
const path = require("path");

const { Api } = require("./api");
const { PersistentDatabase } = require("./db/PersistentDatabase");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const isDev = process.env.NODE_ENV === "development";

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  if (isDev) mainWindow.webContents.openDevTools();

  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}

app.on("ready", async () => {
  try {
    const db = new PersistentDatabase();
    await db.createInstance("db");

    const api = new Api(db);
    api.publish();

    createWindow();
  } catch (err) {
    console.log(err);
  }
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
