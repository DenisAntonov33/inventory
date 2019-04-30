const { getDatabase } = require("../../db/index");
const { Entities } = require("./Entities");
const { BodyParams } = require("./BodyParams");
const { Positions } = require("./Positions");
const { Employees } = require("./Employees");
const { Store } = require("./Store");
const { History } = require("./History");

const {
  BodyParamCollection,
  EntityCollection,
  PositionCollection,
  EmployeeCollection,
  StoreCollection,
  HistoryCollection,
} = require("../../db/collections");

const entities = new Entities(EntityCollection);
const bodyParams = new BodyParams(BodyParamCollection);
const positions = new Positions(PositionCollection);
const employees = new Employees(EmployeeCollection);
const store = new Store(StoreCollection);
const history = new History(HistoryCollection);

describe("History", () => {
  beforeEach(async () => {
    try {
      const dbSuffix = new Date().getTime();
      await getDatabase(`test${dbSuffix}`, "memory");
    } catch (err) {
      console.log(err);
    }
  });

  test("Create", async () => {
    const bodyValueData1 = { name: "value1" };
    const bodyValueData2 = { name: "value2" };

    const bodyParamData1 = { name: "param1" };
    const bodyParamData2 = { name: "param2" };
    let param1 = await bodyParams._create(bodyParamData1);
    let param2 = await bodyParams._create(bodyParamData2);

    param1 = await bodyParams._updateById(param2.id, {
      $create: { values: bodyValueData1 },
    });

    param1 = await bodyParams._updateById(param2.id, {
      $create: { values: bodyValueData2 },
    });

    const entityData1 = { name: "entity1", replacementPeriod: 1 };
    const entityData2 = { name: "entity2", replacementPeriod: 1 };

    let entity1 = await entities._create(entityData1);
    entity1 = await entities._updateById(entity1.id, {
      $set: { bodyParam: param1.id },
    });

    let entity2 = await entities._create(entityData2);
    entity2 = await entities._updateById(entity2.id, {
      $set: { bodyParam: param2.id },
    });

    const positionData1 = { name: "position1" };
    const positionData2 = { name: "position2" };

    let position1 = await positions._create(positionData1);
    position1 = await positions._updateById(position1.id, {
      $push: { entities: entity1.id },
    });

    let position2 = await positions._create(positionData2);
    position2 = await positions._updateById(position2.id, {
      $push: { entities: entity2.id },
    });

    const employeeData1 = { name: "employee1" };

    let employee1 = await employees._create(employeeData1);

    employee1 = await employees._updateById(employee1.id, {
      $push: { positions: position1.id },
    });

    employee1 = await employees._updateById(employee1.id, {
      $push: { positions: position2.id },
    });

    employee1 = await employees._updateById(employee1.id, {
      $push: {
        bodyParams: {
          bodyParam: param1.id,
          bodyValue: param1.values[0].id,
        },
      },
    });

    await store._create({
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

    let history1 = await history._create(historyData1);

    expect(history1).toBeDefined();
    expect.assertions(1);
  });

  test("Create with count 0 - error", async () => {
    try {
      const bodyValueData1 = { name: "value1" };
      const bodyValueData2 = { name: "value2" };

      const bodyParamData1 = { name: "param1" };
      const bodyParamData2 = { name: "param2" };
      let param1 = await bodyParams._create(bodyParamData1);
      let param2 = await bodyParams._create(bodyParamData2);

      param1 = await bodyParams._updateById(param2.id, {
        $create: { values: bodyValueData1 },
      });

      param1 = await bodyParams._updateById(param2.id, {
        $create: { values: bodyValueData2 },
      });

      const entityData1 = { name: "entity1", replacementPeriod: 1 };
      const entityData2 = { name: "entity2", replacementPeriod: 1 };

      let entity1 = await entities._create(entityData1);
      entity1 = await entities._updateById(entity1.id, {
        $set: { bodyParam: param1.id },
      });

      let entity2 = await entities._create(entityData2);
      entity2 = await entities._updateById(entity2.id, {
        $set: { bodyParam: param2.id },
      });

      const positionData1 = { name: "position1" };
      const positionData2 = { name: "position2" };

      let position1 = await positions._create(positionData1);
      position1 = await positions._updateById(position1.id, {
        $push: { entities: entity1.id },
      });

      let position2 = await positions._create(positionData2);
      position2 = await positions._updateById(position2.id, {
        $push: { entities: entity2.id },
      });

      const employeeData1 = { name: "employee1" };

      let employee1 = await employees._create(employeeData1);

      employee1 = await employees._updateById(employee1.id, {
        $push: { positions: position1.id },
      });

      employee1 = await employees._updateById(employee1.id, {
        $push: { positions: position2.id },
      });

      employee1 = await employees._updateById(employee1.id, {
        $push: {
          bodyParams: {
            bodyParam: param1.id,
            bodyValue: param1.values[0].id,
          },
        },
      });

      await store._create({
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

      await history._create(historyData1);
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

      await history._create(historyData1);
    } catch (err) {
      expect(err.message).toBeDefined();
      expect(err.message).toBe("employee required");
      expect.assertions(2);
    }
  });
});
