const { Database } = require("../../db/Database");
const { Api } = require("../../api");

describe("Body Values", () => {
  let api;

  beforeEach(async () => {
    try {
      const dbSuffix = new Date().getTime();
      const db = new Database();
      await db.createInstance(`test${dbSuffix}`);

      api = new Api(db);
    } catch (err) {
      console.log(err);
    }
  });

  test("CRUD Success", async () => {
    const bodyValueData1 = { name: "value1" };
    const bodyValueData2 = { name: "value2" };

    const item1 = await api.bodyValues._create(bodyValueData1);
    const item2 = await api.bodyValues._create(bodyValueData2);

    expect(item1.name).toBe(bodyValueData1.name);
    expect(item2.name).toBe(bodyValueData2.name);

    const expectedItem = await api.bodyValues._readById(item1.id);
    expect(expectedItem.name).toBe(bodyValueData1.name);

    const newName = "paramUpdated";
    const updatedItem = await api.bodyValues._updateById(item1.id, {
      $set: { name: newName },
    });
    expect(updatedItem.name).toBe(newName);

    const removedItem = await api.bodyValues._deleteById(item2.id);
    expect(removedItem.name).toBe(item2.name);

    const unavailableItem = await api.bodyValues._readById(item2.id);
    expect(unavailableItem).toBeNull();

    expect.assertions(6);
  });

  test("Create error", async () => {
    try {
      const bodyValueData1 = { name: "value1", surname: "surname" };
      await api.bodyValues._create(bodyValueData1);
    } catch (err) {
      expect(err.message).toBeDefined();
    }
    expect.assertions(1);
  });

  test("Update error", async () => {
    try {
      const bodyValueData1 = { name: "value1", surname: "surname" };
      const item = await api.bodyValues._create(bodyValueData1);
      await api.bodyValues._updateById(item.id, { surname: "surname" });
    } catch (err) {
      expect(err.message).toBeDefined();
    }
    expect.assertions(1);
  });
});
