const { ipcRenderer } = window.require("electron");

export const login = args => ipcRenderer.sendSync("login", args);
export const signup = args => ipcRenderer.sendSync("signup", args);
export const currentUser = args => ipcRenderer.sendSync("currentUser", args);
