const { getDatabase } = require("../../db/index");
const { Entities } = require("./Entities");
const { BodyParams } = require("./BodyParams");
const { Positions } = require("./Positions");

const {
  BodyParamCollection,
  EntityCollection,
  PositionCollection,
} = require("../../db/collections");

const entities = new Entities(EntityCollection);
const bodyParams = new BodyParams(BodyParamCollection);
const positions = new Positions(PositionCollection);

describe("Positions", () => {
  beforeEach(async () => {
    try {
      const dbSuffix = new Date().getTime();
      await getDatabase(`test${dbSuffix}`, "memory");
    } catch (err) {
      console.log(err);
    }
  });

  test("Adding and removing entities", async () => {
    const bodyParamData1 = { name: "param1" };
    const param1 = await bodyParams._create(bodyParamData1);

    const entityData1 = { name: "entity1", replacementPeriod: 1 };
    const entityData2 = { name: "entity2", replacementPeriod: 2 };

    let entity1 = await entities._create(entityData1);
    entity1 = await entities._updateById(entity1.id, {
      $set: { bodyParam: param1.id },
    });

    let entity2 = await entities._create(entityData2);
    entity2 = await entities._updateById(entity2.id, {
      $set: { bodyParam: param1.id },
    });

    const positionData1 = { name: "position1" };
    let position1 = await positions._create(positionData1);
    expect(position1.name).toBe(positionData1.name);

    position1 = await positions._updateById(position1.id, {
      $push: { entities: entity1.id },
    });
    expect(position1.entities.length).toBe(1);
    expect(position1.entities[0].name).toBe(entityData1.name);

    position1 = await positions._updateById(position1.id, {
      $push: { entities: entity2.id },
    });

    expect(position1.entities.length).toBe(2);

    position1 = await positions._updateById(position1.id, {
      $pull: { entities: entity2.id },
    });

    expect(position1.entities.length).toBe(1);

    expect.assertions(5);
  });
});
