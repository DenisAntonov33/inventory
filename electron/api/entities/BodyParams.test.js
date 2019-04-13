const { getDatabase } = require("../../db/index");
const { BodyParams } = require("./BodyParams");

const { BodyParamCollection } = require("../../db/collections");

const bodyParams = new BodyParams(BodyParamCollection);

describe("BodyParams", () => {
  beforeEach(async () => {
    try {
      const dbSuffix = new Date().getTime();
      await getDatabase(`test${dbSuffix}`, "memory");
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
      $create: { value: bodyValueData1 },
    });

    expect(item.values.length).toBe(1);
    expect(item.values.find(e => e.name === bodyValueData1.name)).toBeDefined();

    item = await bodyParams._updateById(item.id, {
      $create: { value: bodyValueData2 },
    });

    item = await bodyParams._updateById(item.id, {
      $create: { value: bodyValueData3 },
    });

    expect(item.values.length).toBe(3);

    const expectedItem = await bodyParams._readById(item.id);
    expect(typeof expectedItem.values[0]).toBe("object");

    const valueForDeleting = item.values[0];
    item = await bodyParams._updateById(item.id, {
      $pull: { values: valueForDeleting.id },
    });

    expect(item.values.length).toBe(2);
    expect(
      item.values.find(e => e.name === valueForDeleting.name)
    ).toBeUndefined();

    expect.assertions(6);
  });
});
