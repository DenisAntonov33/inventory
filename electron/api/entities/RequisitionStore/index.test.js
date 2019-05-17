const { DateTime } = require("luxon");
const { database } = require("../../../db");
const mockedDatabase = require("./mocks/database.json");

const { RequisitionStore } = require("./index");
const { History } = require("../History");
const { Store } = require("../Store");

const {
  HistoryCollection,
  StoreCollection,
} = require("../../../db/collections");

const history = new History(HistoryCollection);
const store = new Store(StoreCollection);
const requisitionStore = new RequisitionStore();

describe("Requisition Store", () => {
  beforeAll(async () => {
    const dbSuffix = new Date().getTime();
    await database.createInstance(`test${dbSuffix}`);
    await database.load(mockedDatabase);
  });

  test("Create", async () => {
    await history._create({
      date: +DateTime.local()
        .minus({ weeks: 2 })
        .toMillis(),
      positions: ["position1_id"],
      employee: "employee1_id",
      entity: "entity1_id",
      bodyValue: "param1_value1_id",
      count: 1,
    });

    await history._create({
      date: +DateTime.local()
        .minus({ weeks: 3 })
        .toMillis(),
      positions: ["position1_id"],
      employee: "employee2_id",
      entity: "entity2_id",
      bodyValue: "param2_value2_id",
      count: 1,
    });

    const data = await requisitionStore._create({});

    const reqStoreItem1 = data.find(
      e => e.entity === "entity1_id" && e.bodyValue === "param1_value1_id"
    );

    const reqStoreItem2 = data.find(
      e => e.entity === "entity1_id" && e.bodyValue === "param1_value2_id"
    );

    const reqStoreItem3 = data.find(
      e => e.entity === "entity2_id" && e.bodyValue === "param2_value1_id"
    );

    const reqStoreItem4 = data.find(
      e => e.entity === "entity2_id" && e.bodyValue === "param2_value2_id"
    );

    expect(data.length).toBe(4);

    expect(reqStoreItem1.count).toBe(0);
    expect(reqStoreItem2.count).toBe(2);
    expect(reqStoreItem3.count).toBe(1);
    expect(reqStoreItem4.count).toBe(1);

    expect.assertions(5);
  });

  test("Create - with store updating", async () => {
    await store._updateById("entity1_param1_value1_id", {
      $set: { count: 10 },
    });

    await store._updateById("entity1_param1_value2_id", {
      $set: { count: 1 },
    });

    await store._updateById("entity2_param2_value1_id", {
      $set: { count: 10 },
    });

    await store._updateById("entity2_param2_value2_id", {
      $set: { count: 0 },
    });

    const data = await requisitionStore._create({});

    const reqStoreItem1 = data.find(
      e => e.entity === "entity1_id" && e.bodyValue === "param1_value1_id"
    );

    const reqStoreItem2 = data.find(
      e => e.entity === "entity1_id" && e.bodyValue === "param1_value2_id"
    );

    const reqStoreItem3 = data.find(
      e => e.entity === "entity2_id" && e.bodyValue === "param2_value1_id"
    );

    const reqStoreItem4 = data.find(
      e => e.entity === "entity2_id" && e.bodyValue === "param2_value2_id"
    );

    expect(data.length).toBe(4);

    expect(reqStoreItem1.count).toBe(0);
    expect(reqStoreItem2.count).toBe(1);
    expect(reqStoreItem3.count).toBe(0);
    expect(reqStoreItem4.count).toBe(1);

    expect.assertions(5);
  });
});
