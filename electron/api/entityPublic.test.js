const { database } = require("../db/index");

const { signup, me } = require("./auth");

const { BodyValues } = require("./entities/BodyValues");
const { BodyParams } = require("./entities/BodyParams");
const { Entities } = require("./entities/Entities");
const { Positions } = require("./entities/Positions");
const { Employees } = require("./entities/Employees");
const { History } = require("./entities/History");
const { Store } = require("./entities/Store");
const { Requisition } = require("./entities/Requisition");

const {
  BodyValueCollection,
  BodyParamCollection,
  EntityCollection,
  PositionCollection,
  EmployeeCollection,
  HistoryCollection,
  StoreCollection,
} = require("../db/collections");

const bodyValues = new BodyValues(BodyValueCollection);
const bodyParams = new BodyParams(BodyParamCollection);
const entities = new Entities(EntityCollection);
const positions = new Positions(PositionCollection);
const employees = new Employees(EmployeeCollection);
const history = new History(HistoryCollection);
const store = new Store(StoreCollection);
const requisition = new Requisition();

describe("Public", () => {
  let token1, bodyParam1, entity1, position1, employee1, employee2;

  beforeAll(async () => {
    try {
      const dbSuffix = new Date().getTime();
      await database.createInstance(`test${dbSuffix}`, "memory");

      const userData1 = {
        name: `user${new Date().getTime()}`,
        password: "test",
        password1: "test",
      };

      const {
        returnValue: {
          data: { token: _token1 },
        },
      } = await signup({}, userData1);
      token1 = _token1;

      const bodyValueData1 = { name: "value1" };
      const bodyValueData2 = { name: "value2" };

      const bodyParamData1 = {
        name: "param1",
      };

      const {
        returnValue: {
          data: { item: _bodyParam1 },
        },
      } = await bodyParams.create({}, { token: token1, args: bodyParamData1 });

      await bodyParams.updateById(
        {},
        {
          token: token1,
          id: _bodyParam1.id,
          args: { $create: { values: bodyValueData1 } },
        }
      );

      const {
        returnValue: {
          data: { item: __bodyParam1 },
        },
      } = await bodyParams.updateById(
        {},
        {
          token: token1,
          id: _bodyParam1.id,
          args: { $create: { values: bodyValueData2 } },
        }
      );

      bodyParam1 = __bodyParam1;

      const entityData1 = {
        name: "entity1",
        replacementPeriod: 1,
      };

      const {
        returnValue: {
          data: { item: _entity1 },
        },
      } = await entities.create({}, { token: token1, args: entityData1 });

      const {
        returnValue: {
          data: { item: __entity1 },
        },
      } = await entities.updateById(
        {},
        {
          token: token1,
          id: _entity1.id,
          args: { $set: { bodyParam: bodyParam1.id } },
        }
      );
      entity1 = __entity1;

      const positionData1 = { name: "position1" };

      const {
        returnValue: {
          data: { item: _position1 },
        },
      } = await positions.create({}, { token: token1, args: positionData1 });

      const {
        returnValue: {
          data: { item: __position1 },
        },
      } = await positions.updateById(
        {},
        {
          token: token1,
          id: _position1.id,
          args: { $push: { entities: entity1.id } },
        }
      );

      position1 = __position1;

      const employeeData1 = {
        name: "employee1",
      };

      const {
        returnValue: {
          data: { item: _employee1 },
        },
      } = await employees.create({}, { token: token1, args: employeeData1 });

      const {
        returnValue: {
          data: { item: __employee1 },
        },
      } = await employees.updateById(
        {},
        {
          token: token1,
          id: _employee1.id,
          args: {
            $push: {
              positions: position1.id,
              bodyParams: {
                bodyParam: bodyParam1.id,
                bodyValue: bodyParam1.values[0].id,
              },
            },
          },
        }
      );

      employee1 = __employee1;

      const employeeData2 = {
        name: "employee2",
      };

      const {
        returnValue: {
          data: { item: _employee2 },
        },
      } = await employees.create({}, { token: token1, args: employeeData2 });

      const {
        returnValue: {
          data: { item: __employee2 },
        },
      } = await employees.updateById(
        {},
        {
          token: token1,
          id: _employee2.id,
          args: {
            $push: {
              positions: position1.id,
              bodyParams: {
                bodyParam: bodyParam1.id,
                bodyValue: bodyParam1.values[0].id,
              },
            },
          },
        }
      );

      employee2 = __employee2;

      const storeItemData1 = {
        entity: entity1.id,
        bodyValue: bodyParam1.values[0].id,
        count: 20,
      };

      await store.create({}, { token: token1, args: storeItemData1 });
    } catch (err) {
      console.log(err);
    }
  });

  test("Check user availability", async () => {
    const {
      returnValue: {
        status,
        data: { user },
      },
    } = await me({}, { token: token1 });

    expect(status).toBe(200);
    expect(user).toBeDefined();

    expect.assertions(2);
  });

  test("Check store availability", async () => {
    const {
      returnValue: {
        status,
        data: { items },
      },
    } = await store.readMany({}, { token: token1 });

    expect(status).toBe(200);
    expect(items.length).toBe(1);

    expect.assertions(2);
  });

  test("Check history work", async () => {
    const {
      returnValue: {
        data: {
          items: [oldStoreItem],
        },
      },
    } = await store.readMany({}, { token: token1 });

    expect(oldStoreItem.count).toBe(20);

    const historyItemData1 = {
      date: 1,
      employee: employee1.id,
      positions: [position1.id],
      entity: entity1.id,
      bodyValue: bodyParam1.values[0].id,
      count: 1,
    };

    await history.create({}, { token: token1, args: historyItemData1 });

    const {
      returnValue: {
        data: {
          items: [newStoreItem],
        },
      },
    } = await store.readMany({}, { token: token1 });

    expect(newStoreItem.count).toBe(19);

    expect.assertions(2);
  });

  test("Check employee history work", async () => {
    const historyItemData1 = {
      date: 1,
      employee: employee1.id,
      positions: [position1.id],
      entity: entity1.id,
      bodyValue: bodyParam1.values[0].id,
      count: 1,
    };

    const historyItemData2 = {
      date: 1,
      employee: employee2.id,
      positions: [position1.id],
      entity: entity1.id,
      bodyValue: bodyParam1.values[0].id,
      count: 1,
    };

    await history.create({}, { token: token1, args: historyItemData2 });

    await history.create({}, { token: token1, args: historyItemData1 });
    await history.create({}, { token: token1, args: historyItemData1 });
    await history.create({}, { token: token1, args: historyItemData1 });

    const {
      returnValue: {
        data: { items },
      },
    } = await history.readMany(
      {},
      { token: token1, args: { employee: employee1.id } }
    );

    expect(items.every(e => e.employee === employee1.id)).toBeTruthy();
    expect.assertions(1);
  });

  test("Check history work error - 0 items", async () => {
    const storeItemData1 = {
      entity: entity1.id,
      bodyValue: bodyParam1.values[1].id,
      count: 0,
    };

    await store.create({}, { token: token1, args: storeItemData1 });

    const historyItemData1 = {
      date: 1,
      employee: employee1.id,
      positions: [position1.id],
      entity: entity1.id,
      bodyValue: bodyParam1.values[1].id,
      count: 1,
    };

    const {
      returnValue: { status, message },
    } = await history.create({}, { token: token1, args: historyItemData1 });

    expect(status).toBe(500);
    expect(message).toBe("store is empty");

    expect.assertions(2);
  });

  test("Check requisition workflow", async () => {
    const {
      returnValue: {
        data: { items },
      },
    } = await requisition.create({}, { token: token1 });

    expect(items).toBeDefined();
    expect(items.length).toBeGreaterThan(0);

    expect.assertions(2);
  });

  test("Update body value - success", async () => {
    const {
      returnValue: {
        data: { item },
      },
    } = await bodyValues.updateById(
      {},
      {
        token: token1,
        id: bodyParam1.values[0].id,
        args: { $set: { name: "newName" } },
      }
    );

    expect(item.name).toBe("newName");

    expect.assertions(1);
  });
});
