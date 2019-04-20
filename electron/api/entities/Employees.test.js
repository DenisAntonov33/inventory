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
      $create: { values: bodyValueData1 },
    });

    param1 = await bodyParams._updateById(param2.id, {
      $create: { values: bodyValueData2 },
    });

    param2 = await bodyParams._updateById(param2.id, {
      $create: { values: bodyValueData3 },
    });

    param2 = await bodyParams._updateById(param2.id, {
      $create: { values: bodyValueData4 },
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

  test("Adding bodyParams", async () => {
    const bodyValueData1 = { name: "value1" };
    const bodyValueData2 = { name: "value2" };

    const bodyParamData1 = { name: "param1" };
    let param1 = await bodyParams._create(bodyParamData1);

    param1 = await bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData1 },
    });

    param1 = await bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData2 },
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

  test("Removing bodyParams", async () => {
    const bodyValueData1 = { name: "value1" };
    const bodyValueData2 = { name: "value2" };

    const bodyParamData1 = { name: "param1" };
    let param1 = await bodyParams._create(bodyParamData1);

    param1 = await bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData1 },
    });

    param1 = await bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData2 },
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

    employee1 = await employees._updateById(employee1.id, {
      $pull: {
        bodyParams: {
          bodyParam: param1.id,
          bodyValue: param1.values[0].id,
        },
      },
    });

    expect(employee1.bodyParams.length).toBe(0);

    expect.assertions(4);
  });

  test("Adding repeated bodyParams - error", async () => {
    try {
      const bodyValueData1 = { name: "value1" };
      const bodyValueData2 = { name: "value2" };

      const bodyParamData1 = { name: "param1" };
      let param1 = await bodyParams._create(bodyParamData1);

      param1 = await bodyParams._updateById(param1.id, {
        $create: { values: bodyValueData1 },
      });

      param1 = await bodyParams._updateById(param1.id, {
        $create: { values: bodyValueData2 },
      });

      const employeeData1 = { name: "employee1" };
      let employee1 = await employees._create(employeeData1);

      await employees._updateById(employee1.id, {
        $push: {
          bodyParams: {
            bodyParam: param1.id,
            bodyValue: param1.values[0].id,
          },
        },
      });

      await employees._updateById(employee1.id, {
        $push: {
          bodyParams: {
            bodyParam: param1.id,
            bodyValue: param1.values[0].id,
          },
        },
      });
    } catch (err) {
      expect(err.message).toBe("bodyParam with this value already exists");
      expect.assertions(1);
    }
  });

  test("Body Param Id Error", async () => {
    try {
      const bodyValueData1 = { name: "value1" };
      const bodyValueData2 = { name: "value2" };

      const bodyParamData1 = { name: "param1" };
      let param1 = await bodyParams._create(bodyParamData1);

      param1 = await bodyParams._updateById(param1.id, {
        $create: { values: bodyValueData1 },
      });

      param1 = await bodyParams._updateById(param1.id, {
        $create: { values: bodyValueData2 },
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
      expect(err.message).toBe("param required");
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
        $create: { values: bodyValueData1 },
      });

      param1 = await bodyParams._updateById(param1.id, {
        $create: { values: bodyValueData2 },
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

  test("Expand item", async () => {
    const bodyValueData1 = { name: "value1" };
    const bodyValueData2 = { name: "value2" };
    const bodyValueData3 = { name: "value3" };
    const bodyValueData4 = { name: "value4" };

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

    param2 = await bodyParams._updateById(param2.id, {
      $create: { values: bodyValueData3 },
    });

    param2 = await bodyParams._updateById(param2.id, {
      $create: { values: bodyValueData4 },
    });

    const entityData1 = {
      name: "entity1",
      replacementPeriod: 1,
      bodyParam: param1.id,
    };
    const entityData2 = {
      name: "entity1",
      replacementPeriod: 1,
      bodyParam: param2.id,
    };

    let entity1 = await entities._create(entityData1);
    let entity2 = await entities._create(entityData2);

    const positionData1 = { name: "position1", entities: [entity1.id] };
    const positionData2 = { name: "position2", entities: [entity2.id] };

    let position1 = await positions._create(positionData1);
    let position2 = await positions._create(positionData2);

    const employeeData1 = {
      name: "employee1",
      positions: [position1.id, position2.id],
    };

    let employee1 = await employees._create(employeeData1);
    employee1 = await employees._updateById(employee1.id, {
      $push: {
        bodyParams: { bodyParam: param1.id, bodyValue: param1.values[0].id },
      },
    });

    expect(typeof employee1.positions[0]).toBe("object");
    expect(typeof employee1.positions[0].entities[0]).toBe("object");
    expect(typeof employee1.positions[0].entities[0].bodyParam).toBe("object");
    expect(typeof employee1.bodyParams[0]).toBe("object");
    expect(typeof employee1.bodyParams[0].bodyParam).toBe("object");
    expect(typeof employee1.bodyParams[0].bodyValue).toBe("object");

    expect.assertions(6);
  });

  test("Expand list", async () => {
    const bodyValueData1 = { name: "value1" };
    const bodyValueData2 = { name: "value2" };
    const bodyValueData3 = { name: "value3" };
    const bodyValueData4 = { name: "value4" };

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

    param2 = await bodyParams._updateById(param2.id, {
      $create: { values: bodyValueData3 },
    });

    param2 = await bodyParams._updateById(param2.id, {
      $create: { values: bodyValueData4 },
    });

    const entityData1 = {
      name: "entity1",
      replacementPeriod: 1,
      bodyParam: param1.id,
    };
    const entityData2 = {
      name: "entity1",
      replacementPeriod: 1,
      bodyParam: param2.id,
    };

    let entity1 = await entities._create(entityData1);
    let entity2 = await entities._create(entityData2);

    const positionData1 = { name: "position1", entities: [entity1.id] };
    const positionData2 = { name: "position2", entities: [entity2.id] };

    let position1 = await positions._create(positionData1);
    let position2 = await positions._create(positionData2);

    const employeeData1 = {
      name: "employee1",
      positions: [position1.id, position2.id],
    };

    let employee1 = await employees._create(employeeData1);
    employee1 = await employees._updateById(employee1.id, {
      $push: {
        bodyParams: { bodyParam: param1.id, bodyValue: param1.values[0].id },
      },
    });

    const employeesList = await employees._readMany();
    const employeeItem = employeesList.find(e => e.id === employee1.id);

    expect(typeof employeeItem.positions[0]).toBe("object");
    expect(typeof employeeItem.positions[0].entities[0]).toBe("object");
    expect(typeof employeeItem.positions[0].entities[0].bodyParam).toBe(
      "object"
    );
    expect(typeof employeeItem.bodyParams[0]).toBe("object");
    expect(typeof employeeItem.bodyParams[0].bodyParam).toBe("object");
    expect(typeof employeeItem.bodyParams[0].bodyValue).toBe("object");

    expect.assertions(6);
  });
});
