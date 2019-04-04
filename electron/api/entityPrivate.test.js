const { getDatabase } = require("../db/index");
const { Entity } = require("./Entity.js");
const {
  BodyParamCollection,
  BodyValueCollection,
} = require("../db/collections");

const bodyParams = new Entity(BodyParamCollection);

describe("BodyParam", () => {
  beforeAll(async () => {
    try {
      const dbSuffix = new Date().getTime();
      await getDatabase(`test${dbSuffix}`, "memory");
    } catch (err) {
      console.log(err);
    }
  });

  describe("Create", () => {
    const bodyParamData = {
      name: "param1",
    };

    test("Success", async () => {
      expect.assertions(1);
      const item = await bodyParams._create(bodyParamData);
      expect(item.name).toBe(bodyParamData.name);
    });

    test("Failure: name required", async () => {
      expect.assertions(1);
      try {
        await bodyParams._create({ name: null });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe("ReadMany", () => {
    const bodyParamData1 = { name: "param1" };
    const bodyParamData2 = { name: "param2" };
    const bodyParamData3 = { name: "param3" };
    const bodyParamData4 = { name: "param4" };

    beforeAll(async () => {
      try {
        await bodyParams._create(bodyParamData1);
        await bodyParams._create(bodyParamData2);
        await bodyParams._create(bodyParamData3);
        await bodyParams._create(bodyParamData4);
      } catch (err) {
        console.log(err);
      }
    });

    test("Success", async () => {
      expect.assertions(1);
      const items = await bodyParams._readMany({}, {});
      expect(items.length).toBe(5);
    });
  });

  describe("ReadById", () => {
    let id = null;
    const bodyParamData = { name: "param" };

    beforeAll(async () => {
      try {
        const item = await bodyParams._create(bodyParamData);
        id = item.id;
      } catch (err) {
        console.log(err);
      }
    });

    test("Success", async () => {
      expect.assertions(1);
      const item = await bodyParams._readById(id);
      expect(item.name).toBe(bodyParamData.name);
    });
  });

  describe("updateById", () => {
    let id = null;
    const bodyParamData = { name: "param" };

    beforeAll(async () => {
      try {
        const item = await bodyParams._create(bodyParamData);
        id = item.id;
      } catch (err) {
        console.log(err);
      }
    });

    test("Success", async () => {
      expect.assertions(1);
      const item = await bodyParams._updateById(id, { name: "newName" });
      expect(item.name).toBe("newName");
    });
  });

  describe("deleteById", () => {
    let id = null;
    const bodyParamData = { name: "param" };

    beforeAll(async () => {
      try {
        const item = await bodyParams._create(bodyParamData);
        id = item.id;
      } catch (err) {
        console.log(err);
      }
    });

    test("Success", async () => {
      expect.assertions(1);
      const item = await bodyParams._deleteById(id);
      expect(item).toBeDefined();
    });

    test("Failure: empty id", async () => {
      expect.assertions(1);
      try {
        await bodyParams._deleteById(null);
      } catch (err) {
        expect(err.message).toBe("Error: Id required");
      }
    });

    test("Failure: incorrect id", async () => {
      expect.assertions(1);
      try {
        await bodyParams._deleteById(111);
      } catch (err) {
        expect(err.message).toBe("Error: Item not found");
      }
    });
  });

  describe("Add values to param", () => {
    let id = null;
    const bodyParamData = { name: "param" };

    let valueId1, valueId2;
    const bodyValue1Data = { name: "value1" };
    const bodyValue2Data = { name: "value2" };

    beforeAll(async () => {
      try {
        const bodyValues = new Entity(BodyValueCollection);

        const item = await bodyParams._create(bodyParamData);
        id = item.id;

        const item1 = await bodyValues._create(bodyValue1Data);
        valueId1 = item1.id;

        const item2 = await bodyValues._create(bodyValue2Data);
        valueId2 = item2.id;
      } catch (err) {
        console.log(err);
      }
    });

    test("Success", async () => {
      expect.assertions(1);

      const item = await bodyParams._updateById(id, {
        values: [valueId1, valueId2],
      });

      expect(item.values.length).toBe(2);
    });
  });
});
