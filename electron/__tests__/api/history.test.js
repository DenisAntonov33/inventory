const { Database } = require("../../db/Database");
const { Api } = require("../../api");
const mockedDatabase = require("./mocks/history-db.json");

describe("History", () => {
  let api;

  beforeEach(async () => {
    try {
      const dbSuffix = new Date().getTime();
      const db = new Database();
      await db.createInstance(`test${dbSuffix}`);
      await db.load(mockedDatabase);

      api = new Api(db);
    } catch (err) {
      console.log(err);
    }
  });

  test("Create", async () => {
    const historyData1 = {
      date: 1,
      positions: ["position1_id"],
      employee: "employee1_id",
      entity: "entity1_id",
      bodyValue: "param1_value1_id",
      count: 1,
    };

    let history1 = await api.history._create(historyData1);

    expect(history1).toBeDefined();
    expect.assertions(1);
  });

  test("Create with count 0 - error", async () => {
    try {
      const historyData1 = {
        date: 1,
        positions: ["position1_id"],
        employee: "employee1_id",
        entity: "entity1_id",
        bodyValue: "param1_value1_id",
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
