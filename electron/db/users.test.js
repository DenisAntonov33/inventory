const { getInstance, initTestDatabase } = require("./index");
const { users } = require("./users");

describe("User", () => {
  let db = null;

  beforeAll(() => {
    initTestDatabase();
    db = getInstance();
    db.getCollection("users").clear();
  });

  test("Users should be defined", () => {
    expect(users).toBeDefined();
  });

  test("Users methods should be defined", () => {
    expect(users.create).toBeDefined();
    expect(users.readById).toBeDefined();
    expect(users.readByUsername).toBeDefined();
    expect(users.updateById).toBeDefined();
    expect(users.deleteById).toBeDefined();
  });

  describe("User create/read", () => {
    const userData = {
      username: "user",
      password: "psw"
    };

    const user1Data = {
      username: "user1",
      password: "psw"
    };

    beforeAll(() => {
      db.getCollection("users").clear();
    });

    test("User created success", () => {
      const { username } = users.create(userData);
      expect(username).toEqual(userData.username);
    });

    test("User with same usernames failure", () => {
      try {
        users.create(user1Data);
        users.create(user1Data);
      } catch (err) {
        expect(err.message).toBe("Duplicate key for property username: user1");
      }
    });
  });

  describe("User read", () => {
    let user = null;
    const userData = {
      username: "user",
      password: "psw"
    };

    beforeAll(() => {
      db.getCollection("users").clear();
      user = users.create(userData);
    });

    test("User added success", () => {
      const { id } = user;
      const gettedUser = users.readById(id);

      expect(user.username).toEqual(gettedUser.username);
      expect(user.password).toEqual(gettedUser.password);
    });
  });

  describe("User read by username", () => {
    let user = null;
    const userData = {
      username: "user",
      password: "psw"
    };

    beforeAll(() => {
      db.getCollection("users").clear();
      user = users.create(userData);
    });

    test("User added success", () => {
      const { username } = user;
      const gettedUser = users.readByUsername(username);

      expect(user.username).toEqual(gettedUser.username);
      expect(user.password).toEqual(gettedUser.password);
    });
  });

  describe("User update", () => {
    let user = null;

    const userData = {
      username: "user",
      password: "psw"
    };

    beforeAll(() => {
      db.getCollection("users").clear();
      user = users.create(userData);
    });

    test("User update password success", () => {
      const updatedUser = users.updateById(user.id, { password: "psw1" });
      expect(userData.password).not.toBe(updatedUser.password);
    });

    test("Non-exist user update password failure", () => {
      try {
        users.updateById("999", { password: "psw1" });
      } catch (err) {
        expect(err.message).toBe("User is not found");
      }
    });
  });

  describe("User delete", () => {
    let user = null;
    const userData = {
      username: "user",
      password: "psw"
    };

    beforeAll(() => {
      db.getCollection("users").clear();
      user = users.create(userData);
    });

    test("User delete success", () => {
      try {
        const { id } = user;
        users.deleteById(id);
        users.readById(id);
      } catch (err) {
        expect(err.message).toBe("User not found");
      }
    });
  });
});
