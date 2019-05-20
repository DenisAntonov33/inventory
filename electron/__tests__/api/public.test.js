const { Database } = require("../../db/Database");
const { Api } = require("../../api");
const mockedDatabase = require("./mocks/public-db.json");

describe("Public", () => {
  let api, token;

  beforeEach(async () => {
    try {
      const dbSuffix = new Date().getTime();
      const db = new Database();
      await db.createInstance(`test${dbSuffix}`);
      await db.load(mockedDatabase);

      api = new Api(db);

      const {
        returnValue: {
          data: { token: _token },
        },
      } = await api.auth.login({}, { name: "root", password: "root" });

      token = _token;
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
    } = await api.auth.me({}, { token: token });

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
    } = await api.store.readMany({}, { token: token });

    expect(status).toBe(200);
    expect(items.length).toBe(5);

    expect.assertions(2);
  });

  test("Check history work", async () => {
    const {
      returnValue: {
        data: {
          items: [oldStoreItem],
        },
      },
    } = await api.store.readMany({}, { token: token });

    expect(oldStoreItem.count).toBe(5);

    const historyItemData1 = {
      date: 1,
      employee: "employee1_id",
      positions: ["position1_id"],
      entity: "entity1_id",
      bodyValue: "param1_value1_id",
      count: 1,
    };

    await api.history.create({}, { token: token, args: historyItemData1 });

    const {
      returnValue: {
        data: {
          items: [newStoreItem],
        },
      },
    } = await api.store.readMany({}, { token: token });

    expect(newStoreItem.count).toBe(4);

    expect.assertions(2);
  });

  test("Check employee history work", async () => {
    const historyItemData1 = {
      date: 1,
      employee: "employee1_id",
      positions: ["position1_id"],
      entity: "entity1_id",
      bodyValue: "param1_value1_id",
      count: 1,
    };

    const historyItemData2 = {
      date: 1,
      employee: "employee2_id",
      positions: ["position1_id"],
      entity: "entity1_id",
      bodyValue: "param1_value1_id",
      count: 1,
    };

    await api.history.create({}, { token: token, args: historyItemData2 });

    await api.history.create({}, { token: token, args: historyItemData1 });
    await api.history.create({}, { token: token, args: historyItemData1 });
    await api.history.create({}, { token: token, args: historyItemData1 });

    const {
      returnValue: {
        data: { items },
      },
    } = await api.history.readMany(
      {},
      { token: token, args: { employee: "employee1_id" } }
    );

    expect(items.every(e => e.employee === "employee1_id")).toBeTruthy();
    expect.assertions(1);
  });

  test("Check history work error - 0 items", async () => {
    const storeItemData1 = {
      entity: "entity1_id",
      bodyValue: "param1_value2_id",
      count: 0,
    };

    await api.store.create({}, { token: token, args: storeItemData1 });

    const historyItemData1 = {
      date: 1,
      employee: "employee1_id",
      positions: ["position1_id"],
      entity: "entity1_id",
      bodyValue: "param1_value2_id",
      count: 1,
    };

    const {
      returnValue: { status, message },
    } = await api.history.create({}, { token: token, args: historyItemData1 });

    expect(status).toBe(500);
    expect(message).toBe("store is empty");

    expect.assertions(2);
  });

  test("Check requisition workflow", async () => {
    const {
      returnValue: {
        data: { items },
      },
    } = await api.requisition.create({}, { token: token });

    expect(items).toBeDefined();
    expect(items.length).toBeGreaterThan(0);

    expect.assertions(2);
  });

  test("Update body value - success", async () => {
    const {
      returnValue: {
        data: { item },
      },
    } = await api.bodyValues.updateById(
      {},
      {
        token: token,
        id: "param1_value1_id",
        args: { $set: { name: "newName" } },
      }
    );

    expect(item.name).toBe("newName");

    expect.assertions(1);
  });
});
