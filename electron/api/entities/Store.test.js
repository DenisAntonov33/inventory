const { getDatabase } = require("../../db/index");
const { Entities } = require("./Entities");
const { BodyParams } = require("./BodyParams");
const { Store } = require("./Store");

const {
  EntityCollection,
  BodyParamCollection,
  StoreCollection,
} = require("../../db/collections");

const bodyParams = new BodyParams(BodyParamCollection);
const entities = new Entities(EntityCollection);
const store = new Store(StoreCollection);

describe("Entities", () => {
  beforeEach(async () => {
    try {
      const dbSuffix = new Date().getTime();
      await getDatabase(`test${dbSuffix}`, "memory");
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
      $create: { value: bodyValueData1 },
    });

    param1 = await bodyParams._updateById(param1.id, {
      $create: { value: bodyValueData2 },
    });

    const entityData1 = { name: "entity1", replacementPeriod: 1 };

    let entity1 = await entities._create(entityData1);
    entity1 = await entities._updateById(entity1.id, {
      $set: { bodyParam: param1.id },
    });

    const storeData1 = {
      entity: entity1.id,
      bodyValue: param1.values[0].id,
      count: 5,
    };

    let storeItem1 = await store._create(storeData1);

    expect(storeItem1).toBeDefined();
    expect.assertions(1);
  });
});
