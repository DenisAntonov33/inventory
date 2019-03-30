import { getToken } from "../localStorageService";
const { ipcRenderer } = window.require("electron");

const responseHandler = res => {
  try {
    if (!res.status || res.status !== 200) throw new Error(res.message);
    return res.data;
  } catch (err) {
    throw new Error(err.message);
  }
};

const withToken = args => ({ token: getToken(), ...args });

export const loginRequest = args =>
  responseHandler(ipcRenderer.sendSync("login", args));

export const signupRequest = args =>
  responseHandler(ipcRenderer.sendSync("signup", args));

export const meRequest = args =>
  responseHandler(ipcRenderer.sendSync("me", withToken(args)));
