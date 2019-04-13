const { getDatabase } = require("../../db/index");
const { BodyParams } = require("./BodyParams");

const { BodyParamCollection } = require("../../db/collections");

const bodyParams = new BodyParams(BodyParamCollection);

describe("_Entity_ (BodyParams)", () => {
  beforeEach(async () => {
    try {
      const dbSuffix = new Date().getTime();
      await getDatabase(`test${dbSuffix}`, "memory");
    } catch (err) {
      console.log(err);
    }
  });

  test("CRUD Success", async () => {
    const bodyParamData1 = { name: "param1" };
    const bodyParamData2 = { name: "param2" };

    const item1 = await bodyParams._create(bodyParamData1);
    const item2 = await bodyParams._create(bodyParamData2);

    expect(item1.name).toBe(bodyParamData1.name);
    expect(item2.name).toBe(bodyParamData2.name);

    const expectedItem = await bodyParams._readById(item1.id);
    expect(expectedItem.name).toBe(bodyParamData1.name);

    const newName = "paramUpdated";
    const updatedItem = await bodyParams._updateById(item1.id, {
      $set: { name: newName },
    });
    expect(updatedItem.name).toBe(newName);

    const removedItem = await bodyParams._deleteById(item2.id);
    expect(removedItem.name).toBe(item2.name);

    const unavailableItem = await bodyParams._readById(item2.id);
    expect(unavailableItem).toBeNull();

    expect.assertions(6);
  });

  test("Create error", async () => {
    try {
      const bodyParamData1 = { name: "param1", surname: "surname" };
      await bodyParams._create(bodyParamData1);
    } catch (err) {
      expect(err.message).toBeDefined();
      expect.assertions(1);
    }
  });

  test("Update error", async () => {
    try {
      const bodyParamData1 = { name: "param1", surname: "surname" };
      const item = await bodyParams._create(bodyParamData1);
      await bodyParams._updateById(item.id, { surname: "surname" });
    } catch (err) {
      expect(err.message).toBeDefined();
      expect.assertions(1);
    }
  });
});
