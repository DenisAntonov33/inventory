const { ipcRenderer } = window.require("electron");

export const loginRequest = args => ipcRenderer.sendSync("login", args);
export const signupRequest = args => ipcRenderer.sendSync("signup", args);
export const meRequest = args => ipcRenderer.sendSync("me", args);
