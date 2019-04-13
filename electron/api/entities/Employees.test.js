const { getDatabase } = require("../../db/index");
const { Entities } = require("./Entities");
const { BodyParams } = require("./BodyParams");
const { Positions } = require("./Positions");
const { Employees } = require("./Employees");

const {
  BodyParamCollection,
  EntityCollection,
  PositionCollection,
  EmployeeCollection,
} = require("../../db/collections");

const entities = new Entities(EntityCollection);
const bodyParams = new BodyParams(BodyParamCollection);
const positions = new Positions(PositionCollection);
const employees = new Employees(EmployeeCollection);

describe("Employees", () => {
  beforeEach(async () => {
    try {
      const dbSuffix = new Date().getTime();
      await getDatabase(`test${dbSuffix}`, "memory");
    } catch (err) {
      console.log(err);
    }
  });

  test("Adding and removing positions", async () => {
    const bodyValueData1 = { name: "value1" };
    const bodyValueData2 = { name: "value2" };
    const bodyValueData3 = { name: "value3" };
    const bodyValueData4 = { name: "value4" };

    const bodyParamData1 = { name: "param1" };
    const bodyParamData2 = { name: "param2" };
    let param1 = await bodyParams._create(bodyParamData1);
    let param2 = await bodyParams._create(bodyParamData2);

    param1 = await bodyParams._updateById(param2.id, {
      $create: { value: bodyValueData1 },
    });

    param1 = await bodyParams._updateById(param2.id, {
      $create: { value: bodyValueData2 },
    });

    param2 = await bodyParams._updateById(param2.id, {
      $create: { value: bodyValueData3 },
    });

    param2 = await bodyParams._updateById(param2.id, {
      $create: { value: bodyValueData4 },
    });

    const entityData1 = { name: "entity1", replacementPeriod: 1 };
    const entityData2 = { name: "entity1", replacementPeriod: 1 };

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

    expect(employee1.positions.length).toBe(2);
    expect(typeof employee1.positions[0]).toBe("object");

    employee1 = await employees._updateById(employee1.id, {
      $pull: { positions: position2.id },
    });

    expect(employee1.positions.length).toBe(1);

    expect.assertions(3);
  });

  test("Adding and removing bodyParams", async () => {
    const bodyValueData1 = { name: "value1" };
    const bodyValueData2 = { name: "value2" };

    const bodyParamData1 = { name: "param1" };
    let param1 = await bodyParams._create(bodyParamData1);

    param1 = await bodyParams._updateById(param1.id, {
      $create: { value: bodyValueData1 },
    });

    param1 = await bodyParams._updateById(param1.id, {
      $create: { value: bodyValueData2 },
    });

    const employeeData1 = { name: "employee1" };
    let employee1 = await employees._create(employeeData1);

    employee1 = await employees._updateById(employee1.id, {
      $push: {
        bodyParams: {
          bodyParam: param1.id,
          bodyValue: param1.values[0].id,
        },
      },
    });

    expect(employee1.bodyParams.length).toBe(1);
    expect(typeof employee1.bodyParams[0].bodyValue).toBe("object");
    expect(typeof employee1.bodyParams[0].bodyParam).toBe("object");

    expect.assertions(3);
  });

  test("Body Param Id Error", async () => {
    try {
      const bodyValueData1 = { name: "value1" };
      const bodyValueData2 = { name: "value2" };

      const bodyParamData1 = { name: "param1" };
      let param1 = await bodyParams._create(bodyParamData1);

      param1 = await bodyParams._updateById(param1.id, {
        $create: { value: bodyValueData1 },
      });

      param1 = await bodyParams._updateById(param1.id, {
        $create: { value: bodyValueData2 },
      });

      const employeeData1 = { name: "employee1" };
      let employee1 = await employees._create(employeeData1);

      await employees._updateById(employee1.id, {
        $push: {
          bodyParams: {
            bodyParam: "1",
            bodyValue: param1.values[0].id,
          },
        },
      });
    } catch (err) {
      expect(err.message).toBe("Cannot read property 'values' of null");
      expect.assertions(1);
    }
  });

  test("Body Value Id Error", async () => {
    try {
      const bodyValueData1 = { name: "value1" };
      const bodyValueData2 = { name: "value2" };

      const bodyParamData1 = { name: "param1" };
      let param1 = await bodyParams._create(bodyParamData1);

      param1 = await bodyParams._updateById(param1.id, {
        $create: { value: bodyValueData1 },
      });

      param1 = await bodyParams._updateById(param1.id, {
        $create: { value: bodyValueData2 },
      });

      const employeeData1 = { name: "employee1" };
      let employee1 = await employees._create(employeeData1);

      await employees._updateById(employee1.id, {
        $push: {
          bodyParams: {
            bodyParam: param1.id,
            bodyValue: "1",
          },
        },
      });
    } catch (err) {
      expect(err.message).toBeDefined();
      expect.assertions(1);
    }
  });
});
