const { DateTime } = require("luxon");
const { getDatabase } = require("../../db/index");
const { Entities } = require("./Entities");
const { BodyParams } = require("./BodyParams");
const { Positions } = require("./Positions");
const { Employees } = require("./Employees");
const { Store } = require("./Store");
const { History } = require("./History");
const { Requisition } = require("./Requisition");

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
const requisition = new Requisition();

describe("Requisition", () => {
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
    const bodyValueData3 = { name: "value3" };

    const bodyParamData1 = { name: "param1" };

    let param1 = await bodyParams._create(bodyParamData1);

    param1 = await bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData1 },
    });

    param1 = await bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData2 },
    });

    param1 = await bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData3 },
    });

    /* Entities */

    const entityData1 = {
      name: "entity1",
      replacementPeriod: 1,
      bodyParam: param1.id,
    };

    let entity1 = await entities._create(entityData1);

    /* Positions */

    const positionData1 = { name: "position1", entities: [entity1.id] };

    let position1 = await positions._create(positionData1);

    /* employees */
    const employeeData1 = {
      name: "employee1",
      positions: [position1.id],
    };

    let employee1 = await employees._create(employeeData1);

    employee1 = await employees._updateById(employee1.id, {
      $push: {
        bodyParams: {
          bodyParam: param1.id,
          bodyValue: param1.values[0].id,
        },
      },
    });

    const employeeData2 = {
      name: "employee2",
      positions: [position1.id],
    };

    let employee2 = await employees._create(employeeData2);

    employee2 = await employees._updateById(employee2.id, {
      $push: {
        bodyParams: {
          bodyParam: param1.id,
          bodyValue: param1.values[1].id,
        },
      },
    });

    const employeeData3 = {
      name: "employee3",
      positions: [position1.id],
    };

    let employee3 = await employees._create(employeeData3);

    employee3 = await employees._updateById(employee3.id, {
      $push: {
        bodyParams: {
          bodyParam: param1.id,
          bodyValue: param1.values[2].id,
        },
      },
    });

    await store._create({
      entity: entity1.id,
      bodyValue: param1.values[0].id,
      count: 10,
    });

    await store._create({
      entity: entity1.id,
      bodyValue: param1.values[1].id,
      count: 10,
    });

    await store._create({
      entity: entity1.id,
      bodyValue: param1.values[2].id,
      count: 10,
    });

    const data = await requisition._create({});
    const convertedData = data.map(e => ({
      employee: e.employee,
      positions: e.positions,
      entity: e.entity,
      bodyValue: e.bodyValue,
    }));

    const dataItem1 = convertedData.find(
      e => e.bodyValue === param1.values[0].id
    );

    const dataItem2 = convertedData.find(
      e => e.bodyValue === param1.values[1].id
    );

    const dataItem3 = convertedData.find(
      e => e.bodyValue === param1.values[2].id
    );

    expect(dataItem1).toEqual({
      employee: employee1.id,
      positions: [position1.id],
      entity: entity1.id,
      bodyValue: param1.values[0].id,
    });

    expect(dataItem2).toEqual({
      employee: employee2.id,
      positions: [position1.id],
      entity: entity1.id,
      bodyValue: param1.values[1].id,
    });

    expect(dataItem3).toEqual({
      employee: employee3.id,
      positions: [position1.id],
      entity: entity1.id,
      bodyValue: param1.values[2].id,
    });

    expect.assertions(3);
  });

  test("History testing", async () => {
    const bodyValueData1 = { name: "value1" };
    const bodyValueData2 = { name: "value2" };
    const bodyValueData3 = { name: "value3" };

    const bodyParamData1 = { name: "param1" };

    let param1 = await bodyParams._create(bodyParamData1);

    param1 = await bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData1 },
    });

    param1 = await bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData2 },
    });

    param1 = await bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData3 },
    });

    /* Entities */

    const entityData1 = {
      name: "entity1",
      replacementPeriod: 1,
      bodyParam: param1.id,
    };

    let entity1 = await entities._create(entityData1);

    /* Positions */

    const positionData1 = { name: "position1", entities: [entity1.id] };

    let position1 = await positions._create(positionData1);

    /* employees */
    const employeeData1 = {
      name: "employee1",
      positions: [position1.id],
    };

    let employee1 = await employees._create(employeeData1);
    await employees._updateById(employee1.id, {
      $push: {
        bodyParams: {
          bodyParam: param1.id,
          bodyValue: param1.values[0].id,
        },
      },
    });

    const employeeData2 = {
      name: "employee2",
      positions: [position1.id],
    };

    let employee2 = await employees._create(employeeData2);
    await employees._updateById(employee2.id, {
      $push: {
        bodyParams: {
          bodyParam: param1.id,
          bodyValue: param1.values[1].id,
        },
      },
    });

    const employeeData3 = {
      name: "employee3",
      positions: [position1.id],
    };

    let employee3 = await employees._create(employeeData3);
    await employees._updateById(employee3.id, {
      $push: {
        bodyParams: {
          bodyParam: param1.id,
          bodyValue: param1.values[2].id,
        },
      },
    });

    await store._create({
      entity: entity1.id,
      bodyValue: param1.values[0].id,
      count: 10,
    });

    await store._create({
      entity: entity1.id,
      bodyValue: param1.values[1].id,
      count: 20,
    });

    await store._create({
      entity: entity1.id,
      bodyValue: param1.values[2].id,
      count: 30,
    });

    const data = await requisition._create({});

    await Promise.all(data.map(e => history._create(e)));

    const storeItems = await store._readMany();

    const storeItem1 = storeItems.find(
      e => e.entity.id === entity1.id && e.bodyValue.id === param1.values[0].id
    );

    const storeItem2 = storeItems.find(
      e => e.entity.id === entity1.id && e.bodyValue.id === param1.values[1].id
    );

    const storeItem3 = storeItems.find(
      e => e.entity.id === entity1.id && e.bodyValue.id === param1.values[2].id
    );

    expect(storeItem1.count).toBe(9);
    expect(storeItem2.count).toBe(19);
    expect(storeItem3.count).toBe(29);

    expect.assertions(3);
  });

  test("History testing with calculating - store is updated", async () => {
    const bodyValueData1 = { name: "value1" };
    const bodyValueData2 = { name: "value2" };
    const bodyValueData3 = { name: "value3" };

    const bodyParamData1 = { name: "param1" };

    let param1 = await bodyParams._create(bodyParamData1);

    param1 = await bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData1 },
    });

    param1 = await bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData2 },
    });

    param1 = await bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData3 },
    });

    /* Entities */

    const entityData1 = {
      name: "entity1",
      replacementPeriod: 1,
      bodyParam: param1.id,
    };

    let entity1 = await entities._create(entityData1);

    /* Positions */

    const positionData1 = { name: "position1", entities: [entity1.id] };

    let position1 = await positions._create(positionData1);

    /* employees */
    const employeeData1 = {
      name: "employee1",
      positions: [position1.id],
    };

    let employee1 = await employees._create(employeeData1);
    await employees._updateById(employee1.id, {
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
      date: +DateTime.local()
        .minus({ months: 2 })
        .toMillis(),
      positions: [position1.id],
      employee: employee1.id,
      entity: entity1.id,
      bodyValue: param1.values[0].id,
      count: 3,
    };
    await history._create(historyData1);

    const data = await requisition._create({});

    await Promise.all(data.map(e => history._create(e)));
    const storeItems = await store._readMany();

    const storeItem1 = storeItems.find(
      e => e.entity.id === entity1.id && e.bodyValue.id === param1.values[0].id
    );

    expect(storeItem1.count).toBe(7);

    expect.assertions(1);
  });

  test("History testing with calculating - store doesn't update", async () => {
    const bodyValueData1 = { name: "value1" };
    const bodyValueData2 = { name: "value2" };
    const bodyValueData3 = { name: "value3" };

    const bodyParamData1 = { name: "param1" };

    let param1 = await bodyParams._create(bodyParamData1);

    param1 = await bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData1 },
    });

    param1 = await bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData2 },
    });

    param1 = await bodyParams._updateById(param1.id, {
      $create: { values: bodyValueData3 },
    });

    /* Entities */

    const entityData1 = {
      name: "entity1",
      replacementPeriod: 1,
      bodyParam: param1.id,
    };

    let entity1 = await entities._create(entityData1);

    /* Positions */

    const positionData1 = { name: "position1", entities: [entity1.id] };

    let position1 = await positions._create(positionData1);

    /* employees */
    const employeeData1 = {
      name: "employee1",
      positions: [position1.id],
    };

    let employee1 = await employees._create(employeeData1);
    await employees._updateById(employee1.id, {
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
      date: +DateTime.local()
        .minus({ months: 2 })
        .toMillis(),
      positions: [position1.id],
      employee: employee1.id,
      entity: entity1.id,
      bodyValue: param1.values[0].id,
      count: 1,
    };
    await history._create(historyData1);

    const historyData2 = {
      date: +DateTime.local()
        .minus({ months: 1 })
        .toMillis(),
      positions: [position1.id],
      employee: employee1.id,
      entity: entity1.id,
      bodyValue: param1.values[0].id,
      count: 1,
    };
    await history._create(historyData2);

    const data = await requisition._create({});

    await Promise.all(data.map(e => history._create(e)));
    const storeItems = await store._readMany();

    const storeItem1 = storeItems.find(
      e => e.entity.id === entity1.id && e.bodyValue.id === param1.values[0].id
    );

    expect(storeItem1.count).toBe(8);

    expect.assertions(1);
  });
});
