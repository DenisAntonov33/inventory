const { getInstance, initTestDatabase } = require("./index");
const { bodyParams } = require("./bodyParams");

describe("bodyParam", () => {
  let db = null;

  beforeAll(() => {
    initTestDatabase();
    db = getInstance();
    db.getCollection("bodyParams").clear();
  });

  test("bodyParams should be defined", () => {
    expect(bodyParams).toBeDefined();
  });

  test("bodyParams methods should be defined", () => {
    expect(bodyParams.create).toBeDefined();
    expect(bodyParams.readById).toBeDefined();
    expect(bodyParams.updateById).toBeDefined();
    expect(bodyParams.updateValue).toBeDefined();
    expect(bodyParams.deleteById).toBeDefined();
  });

  describe("bodyParam create", () => {
    const bodyParamData = {
      name: "Hands size"
    };

    beforeAll(() => {
      db.getCollection("bodyParams").clear();
    });

    test("bodyParam created success", () => {
      const { name } = bodyParams.create(bodyParamData);
      expect(name).toEqual(bodyParamData.name);
    });

    test("bodyParam created failure: empty name", () => {
      try {
        const { name } = bodyParams.create({});
        expect(name).toEqual(bodyParamData.name);
      } catch (err) {
        expect(err.message).toBe("Name required");
      }
    });
  });

  describe("bodyParam readById", () => {
    let bodyParam = null;
    const bodyParamData = {
      name: "Hands size"
    };

    beforeAll(() => {
      db.getCollection("bodyParams").clear();
      bodyParam = bodyParams.create(bodyParamData);
    });

    test("bodyParam readById success", () => {
      const { name } = bodyParams.readById(bodyParam.id);
      expect(name).toEqual(bodyParamData.name);
    });

    test("bodyParam created failure: empty id", () => {
      try {
        const { name } = bodyParams.readById();
      } catch (err) {
        expect(err.message).toBe("Id required");
      }
    });

    test("bodyParam created failure: wrong id", () => {
      try {
        const { name } = bodyParams.readById("id");
      } catch (err) {
        expect(err.message).toBe("bodyParam not found");
      }
    });
  });

  describe("bodyParam updateById", () => {
    let bodyParam = null;
    const bodyParamData = {
      name: "Hands size"
    };

    beforeAll(() => {
      db.getCollection("bodyParams").clear();
      bodyParam = bodyParams.create(bodyParamData);
    });

    test("bodyParam update name success", () => {
      const { name } = bodyParams.updateById(bodyParam.id, {
        name: "Hands size upd"
      });
      expect(name).not.toBe(bodyParamData.name);
    });

    test("bodyParam add new value success", () => {
      const value = "Size 5";
      const { values } = bodyParams.updateById(bodyParam.id, {
        value
      });
      expect(values.filter(e => e.name === value)).toBeDefined();
    });

    test("bodyParam updateById failure: empty id", () => {
      try {
        const { name } = bodyParams.updateById();
      } catch (err) {
        expect(err.message).toBe("Id required");
      }
    });

    test("bodyParam updateById failure: wrong id", () => {
      try {
        const { name } = bodyParams.updateById("id");
      } catch (err) {
        expect(err.message).toBe("bodyParam not found");
      }
    });
  });

  describe("bodyParam updateValue", () => {
    let bodyParam = null;
    const bodyParamData = {
      name: "Hands size"
    };

    beforeAll(() => {
      db.getCollection("bodyParams").clear();
      bodyParam = bodyParams.create(bodyParamData);
      bodyParam = bodyParams.updateById(bodyParam.id, { value: "size1" });
      bodyParam = bodyParams.updateById(bodyParam.id, { value: "size2" });
    });

    test("bodyParam add new value success", () => {
      const valueId = bodyParam.values[0].id;
      const newValue = "size3";

      const { values } = bodyParams.updateValue(bodyParam.id, {
        valueId,
        value: newValue
      });
      expect(values.filter(e => e.name === newValue)).toBeDefined();
    });

    test("bodyParam updateValue failure: empty param id", () => {
      try {
        const { name } = bodyParams.updateValue();
      } catch (err) {
        expect(err.message).toBe("Id required");
      }
    });

    test("bodyParam updateValue failure: wrong param id", () => {
      try {
        const { name } = bodyParams.updateValue("id", {});
      } catch (err) {
        expect(err.message).toBe("bodyParam not found");
      }
    });

    test("bodyParam updateValue failure: wrong param id", () => {
      try {
        const newValue = "size1";
        const { values } = bodyParams.updateValue(bodyParam.id, {
          value: newValue
        });
      } catch (err) {
        expect(err.message).toBe("valueId required");
      }
    });

    test("bodyParam updateValue failure: missed new value", () => {
      try {
        const valueId = bodyParam.values[0].id;
        const { values } = bodyParams.updateValue(bodyParam.id, {
          valueId
        });
      } catch (err) {
        expect(err.message).toBe("value required");
      }
    });

    test("bodyParam updateValue failure: wrond value id", () => {
      try {
        const newValue = "size1";
        const valueId = "id";
        const { values } = bodyParams.updateValue(bodyParam.id, {
          valueId,
          value: newValue
        });
      } catch (err) {
        expect(err.message).toBe("Value not found");
      }
    });
  });

  describe("User deleteById", () => {
    let bodyParam = null;
    const bodyParamData = {
      name: "bodyParam"
    };

    beforeAll(() => {
      db.getCollection("bodyParams").clear();
      bodyParam = bodyParams.create(bodyParamData);
    });

    test("User delete success", () => {
      try {
        const { id } = bodyParam;
        bodyParams.deleteById(id);
        bodyParams.readById(id);
      } catch (err) {
        expect(err.message).toBe("bodyParam not found");
      }
    });

    test("User delete failure: empty id", () => {
      try {
        const { id } = bodyParam;
        bodyParams.deleteById();
      } catch (err) {
        expect(err.message).toBe("Id required");
      }
    });

    test("User delete failure: empty id", () => {
      try {
        const deleted = bodyParams.deleteById("11");
        expect(deleted).toBeUndefined();
      } catch (err) {}
    });
  });
});
