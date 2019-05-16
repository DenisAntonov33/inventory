const { database } = require("../../../db");
const { BodyValues } = require("./index");

const { BodyValueCollection } = require("../../../db/collections");

const bodyValues = new BodyValues(BodyValueCollection);

describe("BodyValues", () => {
  beforeAll(async () => {
    const dbSuffix = new Date().getTime();
    await database.createInstance(`test${dbSuffix}`);
  });

  test("CRUD Success", async () => {
    const bodyValueData1 = { name: "param1" };
    const bodyValueData2 = { name: "param2" };

    const item1 = await bodyValues._create(bodyValueData1);
    const item2 = await bodyValues._create(bodyValueData2);

    expect(item1.name).toBe(bodyValueData1.name);
    expect(item2.name).toBe(bodyValueData2.name);

    const expectedItem = await bodyValues._readById(item1.id);
    expect(expectedItem.name).toBe(bodyValueData1.name);

    const newName = "paramUpdated";
    const updatedItem = await bodyValues._updateById(item1.id, {
      $set: { name: newName },
    });
    expect(updatedItem.name).toBe(newName);

    const removedItem = await bodyValues._deleteById(item2.id);
    expect(removedItem.name).toBe(item2.name);

    const unavailableItem = await bodyValues._readById(item2.id);
    expect(unavailableItem).toBeNull();

    expect.assertions(6);
  });

  test("Create error", async () => {
    try {
      const bodyValueData1 = { name: "param1", surname: "surname" };
      await bodyValues._create(bodyValueData1);
    } catch (err) {
      expect(err.message).toBeDefined();
    }
    expect.assertions(1);
  });

  test("Update error", async () => {
    try {
      const bodyValueData1 = { name: "param1", surname: "surname" };
      const item = await bodyValues._create(bodyValueData1);
      await bodyValues._updateById(item.id, { surname: "surname" });
    } catch (err) {
      expect(err.message).toBeDefined();
    }
    expect.assertions(1);
  });
});
