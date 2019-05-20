const { Database } = require("../../db/Database");
const { Api } = require("../../api");
const mockedDatabase = require("./mocks/user-db.json");

describe("User", () => {
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

  test("Update", async () => {
    const newUserData = {
      name: "user",
      fullName: "user full name",
      area: "new area",
    };

    const user = await api.user._updateById("user1_id", {
      $set: newUserData,
    });

    expect(user.name).toBe(newUserData.name);
    expect(user.fullName).toBe(newUserData.fullName);
    expect(user.area).toBe(newUserData.area);

    expect.assertions(3);
  });
});
