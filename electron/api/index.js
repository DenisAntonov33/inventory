const { ipcMain } = require("electron");

const { Auth } = require("./modules/Auth");
const { BodyValues } = require("./modules/BodyValues");
const { BodyParams } = require("./modules/BodyParams");
const { Entities } = require("./modules/Entities");
const { Positions } = require("./modules/Positions");
const { Employees } = require("./modules/Employees");
const { History } = require("./modules/History");
const { Store } = require("./modules/Store");
const { Requisition } = require("./modules/Requisition");
const { RequisitionStore } = require("./modules/RequisitionStore");

const {
  BodyValueCollection,
  BodyParamCollection,
  EntityCollection,
  PositionCollection,
  EmployeeCollection,
  HistoryCollection,
  StoreCollection,
  UserCollection,
} = require("../db/collections");

class Api {
  constructor(db) {
    if (!db) throw new Error("db required");

    this.auth = new Auth({ collecton: UserCollection, db });

    this.bodyValues = new BodyValues({
      collection: BodyValueCollection,
      items: {},
      db,
    });

    this.bodyParams = new BodyParams({
      collection: BodyParamCollection,
      items: {
        bodyValues: this.bodyValues,
      },
      db,
    });

    this.entities = new Entities({
      collection: EntityCollection,
      items: {
        bodyParams: this.bodyParams,
      },
      db,
    });

    this.positions = new Positions({
      collection: PositionCollection,
      items: {
        entities: this.entities,
      },
      db,
    });

    this.employees = new Employees({
      collection: EmployeeCollection,
      items: {
        bodyParams: this.bodyParams,
        positions: this.positions,
      },
      db,
    });

    this.store = new Store({
      collection: StoreCollection,
      items: {
        bodyValues: this.bodyValues,
        entities: this.entities,
      },
      db,
    });

    this.history = new History({
      collection: HistoryCollection,
      items: {
        employees: this.employees,
        store: this.store,
      },
      db,
    });

    this.requisition = new Requisition({
      collection: null,
      items: {
        employees: this.employees,
        history: this.history,
      },
      db,
    });

    this.requisitionStore = new RequisitionStore({
      collection: null,
      items: {
        store: this.store,
        requisition: this.requisition,
      },
      db,
    });

    this.items = [
      this.bodyValues,
      this.bodyParams,
      this.entities,
      this.positions,
      this.employees,
      this.history,
      this.store,
    ];
  }

  publish() {
    ipcMain.on("login", this.auth.login.bind(this.auth));
    ipcMain.on("signup", this.auth.signup.bind(this.auth));
    ipcMain.on("me", this.auth.me.bind(this.auth));
    ipcMain.on(
      "requisition_create",
      this.requisition.create.bind(this.requisition)
    );
    ipcMain.on(
      "requisitionStore_create",
      this.requisitionStore.create.bind(this.requisitionStore)
    );

    this.items.forEach(entity => {
      const methods = entity.getMethods();

      methods.forEach(method => {
        ipcMain.on(
          `${entity.collection.link}_${method}`,
          entity[method].bind(entity)
        );
      });
    });
  }
}

exports.Api = Api;
