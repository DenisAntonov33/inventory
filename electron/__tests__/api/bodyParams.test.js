const { Database } = require("../../db/Database");
const { Api } = require("../../api");

describe("Body Params", () => {
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

  test("Adding and removing values", async () => {
    const bodyValueData1 = { name: "value1" };
    const bodyValueData2 = { name: "value2" };
    const bodyValueData3 = { name: "value3" };

    const bodyParamData1 = { name: "param1" };

    let item = api.bodyParams._create(bodyParamData1);

    item = await api.bodyParams._updateById(item.id, {
      $create: { values: bodyValueData1 },
    });

    expect(item.values.length).toBe(1);
    expect(item.values.find(e => e.name === bodyValueData1.name)).toBeDefined();

    item = await api.bodyParams._updateById(item.id, {
      $create: { values: bodyValueData2 },
    });

    item = await api.bodyParams._updateById(item.id, {
      $create: { values: bodyValueData3 },
    });

    expect(item.values.length).toBe(3);

    const expectedItem = await api.bodyParams._readById(item.id);
    expect(typeof expectedItem.values[0]).toBe("object");

    const valueForDeleting = item.values[0];
    item = await api.bodyParams._updateById(item.id, {
      $pull: { values: { id: valueForDeleting.id } },
    });

    expect(item.values.length).toBe(2);
    expect(
      item.values.find(e => e.name === valueForDeleting.name)
    ).toBeUndefined();

    expect.assertions(6);
  });

  test("Expand list", async () => {
    const bodyValueData1 = { name: "value1" };
    const bodyParamData1 = { name: "param1" };
    const bodyParamData2 = { name: "param2" };

    let param1 = api.bodyParams._create(bodyParamData1);
    let param2 = api.bodyParams._create(bodyParamData2);

    await api.bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData1 },
    });

    await api.bodyParams._updateById(param2.id, {
      $create: { values: bodyValueData1 },
    });

    const expectedItems = await api.bodyParams._readMany();

    expect(typeof expectedItems[0].values[0]).toBe("object");
    expect(typeof expectedItems[0].values[0]).toBe("object");

    expect.assertions(2);
  });
});
