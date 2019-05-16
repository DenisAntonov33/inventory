const { database } = require("../../../db");
const mockedDatabase = require("./mocks/database.json");

describe("Requisition Store", () => {
  beforeEach(async () => {
    const dbSuffix = new Date().getTime();
    await database.createInstance(`test${dbSuffix}`);
    await database.load(mockedDatabase);
  });

  test("Create", async () => {
    // const data = await requisitionStore._create({
    //   availableEmployees: ["employee1_id", "employee2_id"],
    // });
    // expect(data.length).toBe(4);
  });
});
