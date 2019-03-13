const { initTestDatabase } = require("./index");
const { users } = require("./users");

describe("User", () => {
  beforeAll(() => {
    initTestDatabase();
  });

  test("User should be defined", () => {
    expect(users).toBeDefined();
  });

  test("User methods should be defined", () => {
    expect(users.create).toBeDefined();
    expect(users.read).toBeDefined();
    expect(users.update).toBeDefined();
    expect(users.delete).toBeDefined();
  });

  test("User added success", () => {
    const user = {
      username: "user999",
      password: "999"
    };

    users.create(user);
    const gettedUser = users.read({ username: user.username });

    expect(gettedUser.username).toEqual(user.username);
    expect(gettedUser.password).toEqual(user.password);
  });

  test("User with same usernames failure", () => {
    try {
      const user = {
        username: "username",
        password: "999"
      };

      users.create(user);
      users.create(user);
    } catch (err) {
      expect(err.message).toBe("Duplicate key for property username: username");
    }
  });
});
