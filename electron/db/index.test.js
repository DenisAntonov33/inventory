const { getDatabase } = require("../db/index");
const {
  BodyValueCollection,
  BodyParamCollection,
  EntityCollection,
  PositionCollection,
  EmployeeCollection,
  HistoryCollection,
  StoreCollection,
  UserCollection,
} = require("./collections");

describe("DB", () => {
  let db = null;

  beforeAll(async () => {
    expect.assertions(1);
    try {
      const dbSuffix = new Date().getTime();
      db = await getDatabase(`test${dbSuffix}`, "memory");
    } catch (err) {
      console.log(err);
    }
  });

  test("DB is defined", async () => {
    expect(db).toBeDefined();
  });

  test("DB collections is defined", async () => {
    expect(db[BodyValueCollection.name]).toBeDefined();
    expect(db[BodyParamCollection.name]).toBeDefined();
    expect(db[EntityCollection.name]).toBeDefined();
    expect(db[PositionCollection.name]).toBeDefined();
    expect(db[EmployeeCollection.name]).toBeDefined();
    expect(db[HistoryCollection.name]).toBeDefined();
    expect(db[StoreCollection.name]).toBeDefined();
    expect(db[UserCollection.name]).toBeDefined();
  });
});
