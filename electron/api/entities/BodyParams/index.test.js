const { database } = require("../../../db");
const { BodyParams } = require("./index");

const { BodyParamCollection } = require("../../../db/collections");

const bodyParams = new BodyParams(BodyParamCollection);

describe("BodyParams", () => {
  beforeAll(async () => {
    try {
      const dbSuffix = new Date().getTime();
      await database.createInstance(`test${dbSuffix}`);
    } catch (err) {
      console.log(err);
    }
  });

  test("Adding and removing values", async () => {
    const bodyValueData1 = { name: "value1" };
    const bodyValueData2 = { name: "value2" };
    const bodyValueData3 = { name: "value3" };

    const bodyParamData1 = { name: "param1" };

    let item = bodyParams._create(bodyParamData1);

    item = await bodyParams._updateById(item.id, {
      $create: { values: bodyValueData1 },
    });

    expect(item.values.length).toBe(1);
    expect(item.values.find(e => e.name === bodyValueData1.name)).toBeDefined();

    item = await bodyParams._updateById(item.id, {
      $create: { values: bodyValueData2 },
    });

    item = await bodyParams._updateById(item.id, {
      $create: { values: bodyValueData3 },
    });

    expect(item.values.length).toBe(3);

    const expectedItem = await bodyParams._readById(item.id);
    expect(typeof expectedItem.values[0]).toBe("object");

    const valueForDeleting = item.values[0];
    item = await bodyParams._updateById(item.id, {
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

    let param1 = bodyParams._create(bodyParamData1);
    let param2 = bodyParams._create(bodyParamData2);

    await bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData1 },
    });

    await bodyParams._updateById(param2.id, {
      $create: { values: bodyValueData1 },
    });

    const expectedItems = await bodyParams._readMany();

    expect(typeof expectedItems[0].values[0]).toBe("object");
    expect(typeof expectedItems[0].values[0]).toBe("object");

    expect.assertions(2);
  });
});
