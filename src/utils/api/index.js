import { getToken } from "../localStorageService";
import collections from "./collections";

let ipcRenderer = { sendSync: query => ({ status: 200, data: query }) };

if (process.env.NODE_ENV !== "test") {
  ipcRenderer = window.require("electron").ipcRenderer;
}

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

export const entityQueries = Object.keys(collections).reduce((acc, key) => {
  const collection = collections[key];
  const link = collection.link;

  const queries = [
    "create",
    "readById",
    "readMany",
    "updateById",
    "deleteById",
  ].reduce((_acc, curr) => {
    const alias = `${link}_${curr}`;

    _acc[curr] = args =>
      responseHandler(ipcRenderer.sendSync(alias, withToken(args)));

    return _acc;
  }, {});

  acc[link] = queries;
  return acc;
}, {});
