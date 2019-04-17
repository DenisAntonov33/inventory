const { getDatabase } = require("../db/index");

const { signup, me } = require("./auth");

const { BodyValues } = require("./entities/BodyValues");
const { BodyParams } = require("./entities/BodyParams");
const { Entities } = require("./entities/Entities");
const { Positions } = require("./entities/Positions");
const { Employees } = require("./entities/Employees");
const { History } = require("./entities/History");

const {
  BodyValueCollection,
  BodyParamCollection,
  EntityCollection,
  PositionCollection,
  EmployeeCollection,
  HistoryCollection,
} = require("../db/collections");

const bodyValues = new BodyValues(BodyValueCollection);
const bodyParams = new BodyParams(BodyParamCollection);
const entities = new Entities(EntityCollection);
const positions = new Positions(PositionCollection);
const employees = new Employees(EmployeeCollection);
const history = new History(HistoryCollection);

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
      } = await bodyValues.create({}, { token: token1, args: bodyValueData1 });
      bodyValue1 = _bodyValue1;

      const {
        returnValue: {
          data: { item: _bodyValue2 },
        },
      } = await bodyValues.create({}, { token: token1, args: bodyValueData2 });
      bodyValue2 = _bodyValue2;

      const bodyParamData1 = {
        name: "param1",
      };

      const {
        returnValue: {
          data: { item: _bodyParam1 },
        },
      } = await bodyParams.create({}, { token: token1, args: bodyParamData1 });

      const {
        returnValue: {
          data: { item: __bodyParam1 },
        },
      } = await bodyParams.updateById(
        {},
        {
          token: token1,
          id: _bodyParam1.id,
          args: { $pushAll: { values: [bodyValue1.id, bodyValue2.id] } },
        }
      );

      bodyParam1 = __bodyParam1;

      const entityData1 = {
        name: "entity1",
        replacementPeriod: 1,
      };

      const {
        returnValue: {
          data: { item: _entity1 },
        },
      } = await entities.create({}, { token: token1, args: entityData1 });

      const {
        returnValue: {
          data: { item: __entity1 },
        },
      } = await entities.updateById(
        {},
        {
          token: token1,
          id: _entity1.id,
          args: { $set: { bodyParam: bodyParam1.id } },
        }
      );
      entity1 = __entity1;

      const positionData1 = { name: "position1" };

      const {
        returnValue: {
          data: { item: _position1 },
        },
      } = await positions.create({}, { token: token1, args: positionData1 });

      const {
        returnValue: {
          data: { item: __position1 },
        },
      } = await positions.updateById(
        {},
        {
          token: token1,
          id: _position1.id,
          args: { $push: { entities: entity1.id } },
        }
      );

      position1 = __position1;

      const employeeData1 = {
        name: "employee1",
      };

      const {
        returnValue: {
          data: { item: _employee1 },
        },
      } = await employees.create({}, { token: token1, args: employeeData1 });

      const {
        returnValue: {
          data: { item: __employee1 },
        },
      } = await employees.updateById(
        {},
        {
          token: token1,
          id: _employee1.id,
          args: {
            $push: {
              positions: position1.id,
              bodyParams: {
                bodyParam: bodyParam1.id,
                bodyValue: bodyValue1.id,
              },
            },
          },
        }
      );

      employee1 = __employee1;

      const historyData1 = {
        date: 1,
        positions: [position1.id],
        employee: employee1.id,
        entity: entity1.id,
        bodyValue: bodyParam1.values[0].id,
      };

      await history.create({}, { token: token1, args: historyData1 });
    } catch (err) {
      console.log(err);
    }
  });

  test("Check user availability", async () => {
    const {
      returnValue: {
        status,
        data: { user },
      },
    } = await me({}, { token: token1 });

    expect(status).toBe(200);
    expect(user).toBeDefined();

    expect.assertions(2);
  });

  test("Check history availability", async () => {
    const {
      returnValue: {
        status,
        data: { items },
      },
    } = await history.readMany({}, { token: token1 });

    const historyItem = items[0];

    expect(status).toBe(200);
    expect(items).toBeDefined();

    expect(historyItem).toBeDefined();
    expect(historyItem.entity).toBeDefined();
    expect(historyItem.employee).toBeDefined();
    expect(historyItem.positions).toBeDefined();
    expect(historyItem.positions.length).toBeGreaterThan(0);
    expect(historyItem.bodyValue).toBeDefined();

    expect.assertions(8);
  });
});
