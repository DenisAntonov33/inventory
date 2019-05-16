const { database } = require("../../../db");
const { Entities } = require("../Entities");
const { BodyParams } = require("../BodyParams");
const { Store } = require("../Store");

const {
  EntityCollection,
  BodyParamCollection,
  StoreCollection,
} = require("../../../db/collections");

const bodyParams = new BodyParams(BodyParamCollection);
const entities = new Entities(EntityCollection);
const store = new Store(StoreCollection);

describe("Store", () => {
  beforeAll(async () => {
    try {
      const dbSuffix = new Date().getTime();
      await database.createInstance(`test${dbSuffix}`);
    } catch (err) {
      console.log(err);
    }
  });

  test("Create", async () => {
    const bodyValueData1 = { name: "value1" };
    const bodyValueData2 = { name: "value2" };

    const bodyParamData1 = { name: "param1" };

    let param1 = await bodyParams._create(bodyParamData1);

    param1 = await bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData1 },
    });

    param1 = await bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData2 },
    });

    const entityData1 = { name: "entity1", replacementPeriod: 1 };

    let entity1 = await entities._create(entityData1);
    entity1 = await entities._updateById(entity1.id, {
      $set: { bodyParam: param1.id },
    });

    let storeItem = await store._create({
      entity: entity1.id,
      bodyValue: param1.values[0].id,
      count: 5,
    });

    storeItem = await store._create({
      entity: entity1.id,
      bodyValue: param1.values[1].id,
      count: 10,
    });

    const items = await store._readMany();

    expect(storeItem).toBeDefined();
    expect(items.length).toBe(2);

    storeItem = await store._updateById(storeItem.id, {
      $set: { count: 100 },
    });

    expect(storeItem.count).toBe(100);
    expect.assertions(3);
  });

  test("Expand item", async () => {
    const bodyValueData1 = { name: "value1" };
    const bodyValueData2 = { name: "value2" };

    const bodyParamData1 = { name: "param1" };

    let param1 = await bodyParams._create(bodyParamData1);

    param1 = await bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData1 },
    });

    param1 = await bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData2 },
    });

    const entityData1 = { name: "entity1", replacementPeriod: 1 };

    let entity1 = await entities._create(entityData1);
    entity1 = await entities._updateById(entity1.id, {
      $set: { bodyParam: param1.id },
    });

    let storeItem = await store._create({
      entity: entity1.id,
      bodyValue: param1.values[0].id,
      count: 5,
    });

    expect(typeof storeItem.entity).toBe("object");
    expect(typeof storeItem.entity.bodyParam).toBe("object");
    expect(typeof storeItem.entity.bodyParam.values[0]).toBe("object");
    expect(typeof storeItem.bodyValue).toBe("object");

    expect.assertions(4);
  });

  test("Expan list", async () => {
    const bodyValueData1 = { name: "value1" };
    const bodyValueData2 = { name: "value2" };

    const bodyParamData1 = { name: "param1" };

    let param1 = await bodyParams._create(bodyParamData1);

    param1 = await bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData1 },
    });

    param1 = await bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData2 },
    });

    const entityData1 = { name: "entity1", replacementPeriod: 1 };

    let entity1 = await entities._create(entityData1);
    entity1 = await entities._updateById(entity1.id, {
      $set: { bodyParam: param1.id },
    });

    await store._create({
      entity: entity1.id,
      bodyValue: param1.values[0].id,
      count: 5,
    });

    await store._create({
      entity: entity1.id,
      bodyValue: param1.values[1].id,
      count: 10,
    });

    const items = await store._readMany();
    const storeItem = items[0];

    expect(typeof storeItem.entity).toBe("object");
    expect(typeof storeItem.entity.bodyParam).toBe("object");
    expect(typeof storeItem.entity.bodyParam.values[0]).toBe("object");
    expect(typeof storeItem.bodyValue).toBe("object");

    expect.assertions(4);
  });
});
