const { Database } = require("../../db/Database");
const { Api } = require("../../api");
const mockedDatabase = require("./mocks/store-db.json");

describe("Requisition Store", () => {
  let api;

  beforeEach(async () => {
    try {
      const dbSuffix = new Date().getTime();
      const db = new Database();
      await db.createInstance(`test${dbSuffix}`);
      await db.load(mockedDatabase);

      api = new Api(db);
    } catch (err) {
      console.log(err);
    }
  });

  test("Create", async () => {
    let storeItem = await api.store._create({
      entity: "entity1_id",
      bodyValue: "param1_value1_id",
      count: 5,
    });

    storeItem = await api.store._create({
      entity: "entity1_id",
      bodyValue: "param1_value2_id",
      count: 10,
    });

    const items = await api.store._readMany();

    expect(storeItem).toBeDefined();
    expect(items.length).toBe(2);

    storeItem = await api.store._updateById(storeItem.id, {
      $set: { count: 100 },
    });

    expect(storeItem.count).toBe(100);
    expect.assertions(3);
  });

  test("Expand item", async () => {
    let storeItem = await api.store._create({
      entity: "entity1_id",
      bodyValue: "param1_value1_id",
      count: 5,
    });

    expect(typeof storeItem.entity).toBe("object");
    expect(typeof storeItem.entity.bodyParam).toBe("object");
    expect(typeof storeItem.entity.bodyParam.values[0]).toBe("object");
    expect(typeof storeItem.bodyValue).toBe("object");

    expect.assertions(4);
  });

  test("Expand item without bodyValue", async () => {
    let storeItem = await api.store._create({
      entity: "entity3_id",
      count: 5,
    });

    expect(typeof storeItem.entity).toBe("object");
    expect(storeItem.entity.bodyParam).toBeUndefined();
    expect(storeItem.bodyValue).toBeUndefined();

    expect.assertions(3);
  });

  test("Expand list", async () => {
    await api.store._create({
      entity: "entity1_id",
      bodyValue: "param1_value1_id",
      count: 5,
    });

    await api.store._create({
      entity: "entity1_id",
      bodyValue: "param1_value2_id",
      count: 10,
    });

    const items = await api.store._readMany();
    const storeItem = items[0];

    expect(typeof storeItem.entity).toBe("object");
    expect(typeof storeItem.entity.bodyParam).toBe("object");
    expect(typeof storeItem.entity.bodyParam.values[0]).toBe("object");
    expect(typeof storeItem.bodyValue).toBe("object");

    expect.assertions(4);
  });

  test("Expan list without bodyParam", async () => {
    await api.store._create({
      entity: "entity3_id",
      count: 5,
    });

    const items = await api.store._readMany();
    const storeItem = items[0];

    expect(typeof storeItem.entity).toBe("object");
    expect(storeItem.entity.bodyParam).toBeUndefined();
    expect(storeItem.bodyValue).toBeUndefined();

    expect.assertions(3);
  });
});
