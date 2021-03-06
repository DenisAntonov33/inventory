import { getToken } from "../localStorageService";

export const collections = [
  "bodyValues",
  "bodyParams",
  "entities",
  "positions",
  "employees",
  "history",
  "store",
];

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

export const entityQueries = collections.reduce((acc, collection) => {
  const queries = [
    "create",
    "readById",
    "readMany",
    "updateById",
    "deleteById",
  ].reduce((_acc, curr) => {
    const alias = `${collection}_${curr}`;

    _acc[curr] = args =>
      responseHandler(ipcRenderer.sendSync(alias, withToken(args)));

    return _acc;
  }, {});

  acc[collection] = queries;
  return acc;
}, {});

export const createRequisitionRequest = args =>
  responseHandler(ipcRenderer.sendSync("requisition_create", withToken(args)));

export const createRequisitionStoreRequest = args =>
  responseHandler(
    ipcRenderer.sendSync("requisitionStore_create", withToken(args))
  );
