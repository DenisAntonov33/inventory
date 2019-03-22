const { getDatabase } = require("../db/index");
const { Entity } = require("./Entity.js");
const { BodyParamCollection } = require("../db/collections");

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

      const {
        returnValue: {
          data: { item },
        },
      } = await bodyParams.create({}, bodyParamData);

      expect(item.name).toBe(bodyParamData.name);
    });

    test("Failure: name required", async () => {
      expect.assertions(1);

      const {
        returnValue: { status },
      } = await bodyParams.create({}, { name: null });

      expect(status).toBe(500);
    });
  });

  describe("ReadAll", () => {
    const bodyParamData1 = { name: "param1" };
    const bodyParamData2 = { name: "param2" };
    const bodyParamData3 = { name: "param3" };
    const bodyParamData4 = { name: "param4" };

    beforeAll(async () => {
      try {
        await bodyParams.create({}, bodyParamData1);
        await bodyParams.create({}, bodyParamData2);
        await bodyParams.create({}, bodyParamData3);
        await bodyParams.create({}, bodyParamData4);
      } catch (err) {
        console.log(err);
      }
    });

    test("Success", async () => {
      expect.assertions(1);

      const {
        returnValue: {
          data: { items },
        },
      } = await bodyParams.readAll({});

      expect(items.length).toBe(5);
    });
  });

  describe("ReadById", () => {
    let id = null;
    const bodyParamData = { name: "param" };

    beforeAll(async () => {
      try {
        const {
          returnValue: {
            data: { item },
          },
        } = await bodyParams.create({}, bodyParamData);

        id = item.id;
      } catch (err) {
        console.log(err);
      }
    });

    test("Success", async () => {
      expect.assertions(2);

      const {
        returnValue: {
          status,
          data: { item },
        },
      } = await bodyParams.readById({}, id);

      expect(status).toBe(200);
      expect(item.name).toBe(bodyParamData.name);
    });
  });

  describe("updateById", () => {
    let id = null;
    const bodyParamData = { name: "param" };

    beforeAll(async () => {
      try {
        const {
          returnValue: {
            data: { item },
          },
        } = await bodyParams.create({}, bodyParamData);

        id = item.id;
      } catch (err) {
        console.log(err);
      }
    });

    test("Success", async () => {
      expect.assertions(2);

      const {
        returnValue: {
          status,
          data: { item },
        },
      } = await bodyParams.updateById({}, id, { name: "newName" });

      expect(status).toBe(200);
      expect(item.name).toBe("newName");
    });
  });

  describe("deleteById", () => {
    let id = null;
    const bodyParamData = { name: "param" };

    beforeAll(async () => {
      try {
        const {
          returnValue: {
            data: { item },
          },
        } = await bodyParams.create({}, bodyParamData);

        id = item.id;
      } catch (err) {
        console.log(err);
      }
    });

    test("Success", async () => {
      expect.assertions(1);

      const {
        returnValue: { status },
      } = await bodyParams.deleteById({}, id);

      expect(status).toBe(200);
    });
  });
});