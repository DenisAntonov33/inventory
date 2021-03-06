const { DateTime } = require("luxon");
const mockedDatabase = require("./mocks/database.json");
const { database } = require("../../../db");
const { Requisition } = require("../Requisition");

const { History } = require("../History");
const { HistoryCollection } = require("../../../db/collections");

const history = new History(HistoryCollection);
const requisition = new Requisition();

describe("Requisition", () => {
  beforeAll(async () => {
    try {
      const dbSuffix = new Date().getTime();
      await database.createInstance(`test${dbSuffix}`);
      await database.load(mockedDatabase);
    } catch (err) {
      console.log(err);
    }
  });

  test("Create - shoud be 6 items", async () => {
    const data = await requisition._create({});
    expect(data.length).toBe(6);
    expect.assertions(1);
  });

  test("With history - shoud be 6 items, 2 with count 0", async () => {
    await history._create({
      date: +DateTime.local()
        .minus({ weeks: 2 })
        .toMillis(),
      positions: ["position1_id"],
      employee: "employee1_id",
      entity: "entity1_id",
      bodyValue: "param1_value1_id",
      count: 1,
    });

    await history._create({
      date: +DateTime.local()
        .minus({ weeks: 3 })
        .toMillis(),
      positions: ["position1_id"],
      employee: "employee2_id",
      entity: "entity2_id",
      bodyValue: "param2_value2_id",
      count: 1,
    });

    const data = await requisition._create({});
    const item1 = data.find(
      e =>
        e.employee === "employee1_id" &&
        e.entity === "entity1_id" &&
        e.bodyValue === "param1_value1_id"
    );

    const item2 = data.find(
      e =>
        e.employee === "employee2_id" &&
        e.entity === "entity2_id" &&
        e.bodyValue === "param2_value2_id"
    );

    const item3 = data.find(
      e =>
        e.employee === "employee1_id" &&
        e.entity === "entity2_id" &&
        e.bodyValue === "param2_value1_id"
    );

    expect(item1.count).toBe(0);
    expect(item2.count).toBe(0);
    expect(item3.count).toBe(1);

    expect.assertions(3);
  });
});
