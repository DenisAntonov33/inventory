const { Database } = require("../../db/Database");
const { Api } = require("../../api");

describe("History", () => {
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

  test("Create", async () => {
    const bodyValueData1 = { name: "value1" };
    const bodyValueData2 = { name: "value2" };

    const bodyParamData1 = { name: "param1" };
    const bodyParamData2 = { name: "param2" };
    let param1 = await api.bodyParams._create(bodyParamData1);
    let param2 = await api.bodyParams._create(bodyParamData2);

    param1 = await api.bodyParams._updateById(param2.id, {
      $create: { values: bodyValueData1 },
    });

    param1 = await api.bodyParams._updateById(param2.id, {
      $create: { values: bodyValueData2 },
    });

    const entityData1 = { name: "entity1", replacementPeriod: 1 };
    const entityData2 = { name: "entity2", replacementPeriod: 1 };

    let entity1 = await api.entities._create(entityData1);
    entity1 = await api.entities._updateById(entity1.id, {
      $set: { bodyParam: param1.id },
    });

    let entity2 = await api.entities._create(entityData2);
    entity2 = await api.entities._updateById(entity2.id, {
      $set: { bodyParam: param2.id },
    });

    const positionData1 = { name: "position1" };
    const positionData2 = { name: "position2" };

    let position1 = await api.positions._create(positionData1);
    position1 = await api.positions._updateById(position1.id, {
      $push: { entities: entity1.id },
    });

    let position2 = await api.positions._create(positionData2);
    position2 = await api.positions._updateById(position2.id, {
      $push: { entities: entity2.id },
    });

    const employeeData1 = { name: "employee1" };

    let employee1 = await api.employees._create(employeeData1);

    employee1 = await api.employees._updateById(employee1.id, {
      $push: { positions: position1.id },
    });

    employee1 = await api.employees._updateById(employee1.id, {
      $push: { positions: position2.id },
    });

    employee1 = await api.employees._updateById(employee1.id, {
      $push: {
        bodyParams: {
          bodyParam: param1.id,
          bodyValue: param1.values[0].id,
        },
      },
    });

    await api.store._create({
      entity: entity1.id,
      bodyValue: param1.values[0].id,
      count: 10,
    });

    const historyData1 = {
      date: 1,
      positions: [position1.id, position2.id],
      employee: employee1.id,
      entity: entity1.id,
      bodyValue: param1.values[0].id,
      count: 1,
    };

    let history1 = await api.history._create(historyData1);

    expect(history1).toBeDefined();
    expect.assertions(1);
  });

  test("Create with count 0 - error", async () => {
    try {
      const bodyValueData1 = { name: "value1" };
      const bodyValueData2 = { name: "value2" };

      const bodyParamData1 = { name: "param1" };
      const bodyParamData2 = { name: "param2" };
      let param1 = await api.bodyParams._create(bodyParamData1);
      let param2 = await api.bodyParams._create(bodyParamData2);

      param1 = await api.bodyParams._updateById(param2.id, {
        $create: { values: bodyValueData1 },
      });

      param1 = await api.bodyParams._updateById(param2.id, {
        $create: { values: bodyValueData2 },
      });

      const entityData1 = { name: "entity1", replacementPeriod: 1 };
      const entityData2 = { name: "entity2", replacementPeriod: 1 };

      let entity1 = await api.entities._create(entityData1);
      entity1 = await api.entities._updateById(entity1.id, {
        $set: { bodyParam: param1.id },
      });

      let entity2 = await api.entities._create(entityData2);
      entity2 = await api.entities._updateById(entity2.id, {
        $set: { bodyParam: param2.id },
      });

      const positionData1 = { name: "position1" };
      const positionData2 = { name: "position2" };

      let position1 = await api.positions._create(positionData1);
      position1 = await api.positions._updateById(position1.id, {
        $push: { entities: entity1.id },
      });

      let position2 = await api.positions._create(positionData2);
      position2 = await api.positions._updateById(position2.id, {
        $push: { entities: entity2.id },
      });

      const employeeData1 = { name: "employee1" };

      let employee1 = await api.employees._create(employeeData1);

      employee1 = await api.employees._updateById(employee1.id, {
        $push: { positions: position1.id },
      });

      employee1 = await api.employees._updateById(employee1.id, {
        $push: { positions: position2.id },
      });

      employee1 = await api.employees._updateById(employee1.id, {
        $push: {
          bodyParams: {
            bodyParam: param1.id,
            bodyValue: param1.values[0].id,
          },
        },
      });

      await api.store._create({
        entity: entity1.id,
        bodyValue: param1.values[0].id,
        count: 10,
      });

      const historyData1 = {
        date: 1,
        positions: [position1.id, position2.id],
        employee: employee1.id,
        entity: entity1.id,
        bodyValue: param1.values[0].id,
        count: 0,
      };

      await api.history._create(historyData1);
    } catch (err) {
      expect(err.message).toBeDefined();
      expect(err.message).toBe("count shoud be more than 0");
      expect.assertions(2);
    }
  });

  test("Creating error - employee required", async () => {
    try {
      const historyData1 = {
        date: 1,
      };

      await api.history._create(historyData1);
    } catch (err) {
      expect(err.message).toBeDefined();
      expect(err.message).toBe("employee required");
      expect.assertions(2);
    }
  });
});
