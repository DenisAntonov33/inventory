const { getDatabase } = require("../db/index");
const { Entity } = require("./Entity.js");
const { signup, me } = require("./auth");

const {
  BodyValueCollection,
  BodyParamCollection,
  EntityCollection,
  PositionCollection,
  EmployeeCollection,
  HistoryCollection,
} = require("../db/collections");

const bodyValues = new Entity(BodyValueCollection);
const bodyParams = new Entity(BodyParamCollection);
const entities = new Entity(EntityCollection);
const positions = new Entity(PositionCollection);
const employees = new Entity(EmployeeCollection);
const history = new Entity(HistoryCollection);

describe("Entity", () => {
  let token1, bodyValue1, bodyValue2, bodyParam1, entity1, position1, employee1;

  beforeAll(async () => {
    try {
      const dbSuffix = new Date().getTime();
      await getDatabase(`test${dbSuffix}`, "memory");

      const userData1 = {
        name: `user${new Date().getTime()}`,
        password: "test",
        password1: "test",
      };

      const {
        returnValue: {
          data: { token: _token1 },
        },
      } = await signup({}, userData1);
      token1 = _token1;

      const bodyValueData1 = { name: "value1" };
      const bodyValueData2 = { name: "value2" };

      const {
        returnValue: {
          data: { item: _bodyValue1 },
        },
      } = await bodyValues.create({}, token1, bodyValueData1);
      bodyValue1 = _bodyValue1;

      const {
        returnValue: {
          data: { item: _bodyValue2 },
        },
      } = await bodyValues.create({}, token1, bodyValueData2);
      bodyValue2 = _bodyValue2;

      const bodyParamData1 = {
        name: "param1",
        values: [bodyValue1.id, bodyValue2.id],
      };

      const {
        returnValue: {
          data: { item: _bodyParam1 },
        },
      } = await bodyParams.create({}, token1, bodyParamData1);
      bodyParam1 = _bodyParam1;

      const entityData1 = {
        name: "entity1",
        replacementPeriod: "1",
        bodyParam: bodyParam1.id,
      };

      const {
        returnValue: {
          data: { item: _entity1 },
        },
      } = await entities.create({}, token1, entityData1);
      entity1 = _entity1;

      const positionData1 = { name: "position1", entities: [entity1.id] };

      const {
        returnValue: {
          data: { item: _position1 },
        },
      } = await positions.create({}, token1, positionData1);
      position1 = _position1;

      const employeeData1 = {
        name: "employee1",
        positions: [position1.id],
        bodyParams: [{ bodyParam: bodyParam1.id, bodyValue: bodyValue1.id }],
        history: [],
      };

      const {
        returnValue: {
          data: { item: _employee1 },
        },
      } = await employees.create({}, token1, employeeData1);
      employee1 = _employee1;

      const historyItemData1 = {
        date: new Date().toString(),
        positions: [position1.name],
        employee: employee1.name,
        entity: entity1.name,
        bodyValue: bodyValue1.name,
      };

      await history.create({}, token1, historyItemData1);
    } catch (err) {
      console.log(err);
    }
  });

  test("Check data availability", async () => {
    expect.assertions(7);

    const {
      returnValue: {
        status,
        data: { user },
      },
    } = await me({}, token1);

    expect(status).toBe(200);
    expect(user.data).toBeDefined();

    expect(user.data[BodyValueCollection.link].length).toBe(2);
    expect(user.data[BodyParamCollection.link].length).toBe(1);
    expect(user.data[EntityCollection.link].length).toBe(1);
    expect(user.data[PositionCollection.link].length).toBe(1);
    expect(user.data[EmployeeCollection.link].length).toBe(1);
  });
});
