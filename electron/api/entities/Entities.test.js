const { getDatabase } = require("../../db/index");
const { Entities } = require("./Entities");
const { BodyParams } = require("./BodyParams");

const {
  BodyParamCollection,
  EntityCollection,
} = require("../../db/collections");

const entities = new Entities(EntityCollection);
const bodyParams = new BodyParams(BodyParamCollection);

describe("Entities", () => {
  beforeEach(async () => {
    try {
      const dbSuffix = new Date().getTime();
      await getDatabase(`test${dbSuffix}`, "memory");
    } catch (err) {
      console.log(err);
    }
  });

  test("Creating", async () => {
    const bodyParamData1 = { name: "param1" };
    const param1 = await bodyParams._create(bodyParamData1);

    const entityData1 = {
      name: "param1",
      replacementPeriod: 1,
      bodyParam: param1.id,
    };
    const entity1 = await entities._create(entityData1);

    expect(entity1.name).toBe(entityData1.name);
    expect(entity1.bodyParam.name).toBe(param1.name);

    expect.assertions(2);
  });

  test("Adding and removing params", async () => {
    const bodyParamData1 = { name: "param1" };
    const bodyParamData2 = { name: "param2" };
    const param1 = await bodyParams._create(bodyParamData1);
    const param2 = await bodyParams._create(bodyParamData2);

    const entityData1 = { name: "param1", replacementPeriod: 1 };
    let entity1 = await entities._create(entityData1);
    expect(entity1.name).toBe(entityData1.name);

    entity1 = await entities._updateById(entity1.id, {
      $set: { bodyParam: param1.id },
    });
    expect(entity1.bodyParam.name).toBe(param1.name);

    entity1 = await entities._updateById(entity1.id, {
      $set: { bodyParam: param2.id },
    });
    expect(entity1.bodyParam.name).toBe(param2.name);

    expect.assertions(3);
  });

  test("Expand item", async () => {
    const bodyValueData1 = { name: "value1" };

    const bodyParamData1 = { name: "param1" };
    const bodyParamData2 = { name: "param2" };

    let param1 = await bodyParams._create(bodyParamData1);
    let param2 = await bodyParams._create(bodyParamData2);

    param1 = await bodyParams._updateById(param2.id, {
      $create: { values: bodyValueData1 },
    });

    const entityData1 = {
      name: "param1",
      replacementPeriod: 1,
      bodyParam: param1.id,
    };
    const entity1 = await entities._create(entityData1);

    expect(typeof entity1.bodyParam).toBe("object");
    expect(typeof entity1.bodyParam.values[0]).toBe("object");

    expect.assertions(2);
  });

  test("Expand list", async () => {
    const bodyValueData1 = { name: "value1" };

    const bodyParamData1 = { name: "param1" };

    let param1 = await bodyParams._create(bodyParamData1);
    param1 = await bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData1 },
    });

    const entityData1 = {
      name: "entity1",
      replacementPeriod: 1,
      bodyParam: param1.id,
    };
    const entity1 = await entities._create(entityData1);

    const entitiesList = await entities._readMany();
    const entitiyItem = entitiesList.find(e => e.id === entity1.id);

    expect(typeof entitiyItem.bodyParam).toBe("object");
    expect(typeof entitiyItem.bodyParam.values[0]).toBe("object");

    expect.assertions(2);
  });
});
