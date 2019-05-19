const { Database } = require("../../db/Database");
const { Api } = require("../../api");
const mockedDatabase = require("./mocks/entities-db.json");

describe("Entities", () => {
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

  test("Creating", async () => {
    const entityData1 = {
      name: "entity1",
      replacementPeriod: 1,
      bodyParam: "param1_id",
    };
    const entity1 = await api.entities._create(entityData1);

    expect(entity1.name).toBe(entityData1.name);
    expect(entity1.bodyParam.name).toBe("param1");

    expect.assertions(2);
  });

  test("Creating without param", async () => {
    const entityData = {
      name: "entity-without-param",
      replacementPeriod: 1,
    };

    const entity = await api.entities._create(entityData);

    expect(entity.name).toBe(entityData.name);
    expect(entity.bodyParam).toBeUndefined();

    expect.assertions(2);
  });

  test("Adding and removing params", async () => {
    const entityData1 = { name: "entity1", replacementPeriod: 1 };
    let entity1 = await api.entities._create(entityData1);

    entity1 = await api.entities._updateById(entity1.id, {
      $set: { bodyParam: "param1_id" },
    });
    expect(entity1.bodyParam.name).toBe("param1");

    entity1 = await api.entities._updateById(entity1.id, {
      $set: { bodyParam: "param2_id" },
    });
    expect(entity1.bodyParam.name).toBe("param2");

    expect.assertions(2);
  });

  test("Expand item", async () => {
    const entityData1 = {
      name: "entity1",
      replacementPeriod: 1,
      bodyParam: "param1_id",
    };
    const entity1 = await api.entities._create(entityData1);

    expect(typeof entity1.bodyParam).toBe("object");
    expect(typeof entity1.bodyParam.values[0]).toBe("object");

    expect.assertions(2);
  });

  test("Expand list", async () => {
    const entityData1 = {
      name: "entity1",
      replacementPeriod: 1,
      bodyParam: "param1_id",
    };
    const entity1 = await api.entities._create(entityData1);

    const entitiesList = await api.entities._readMany();
    const entitiyItem = entitiesList.find(e => e.id === entity1.id);

    expect(typeof entitiyItem.bodyParam).toBe("object");
    expect(typeof entitiyItem.bodyParam.values[0]).toBe("object");

    expect.assertions(2);
  });

  test("Expand list - entity without param", async () => {
    const entityData1 = {
      name: "expanded-entity-without-param",
      replacementPeriod: 1,
    };
    const entity1 = await api.entities._create(entityData1);

    const entitiesList = await api.entities._readMany();
    const entitiyItem = entitiesList.find(e => e.id === entity1.id);

    expect(typeof entitiyItem.bodyParam).toBe("undefined");
    expect.assertions(1);
  });
});
