const { getInstance, initTestDatabase } = require("../db/index");
const { login, signup } = require("./auth");

describe("Auth", () => {
  let db = null;

  beforeAll(() => {
    initTestDatabase();
    db = getInstance();
  });

  describe("Signup", () => {
    const userData = {
      username: "user",
      password: "test",
      password1: "test"
    };

    beforeAll(() => {
      db.getCollection("users").clear();
    });

    test("User signup success", () => {
      const {
        returnValue: { status, data }
      } = signup({}, userData);

      expect(status).toBe(200);
      expect(data).toBeDefined();
    });

    test("User signup same password fail", () => {
      const {
        returnValue: { status, message }
      } = signup({}, { ...userData, password1: "1" });

      expect(status).toBe(500);
      expect(message).toBe("Password should be the same");
    });

    test("User signup same username", () => {
      const {
        returnValue: { status, message }
      } = signup({}, userData);

      expect(status).toBe(500);
      expect(message).toBe("Duplicate key for property username: user");
    });
  });

  describe("Login", () => {
    const userData = {
      username: "user",
      password: "psw",
      password1: "psw"
    };

    beforeAll(() => {
      db.getCollection("users").clear();
      signup({}, userData);
    });

    test("User login success", () => {
      const {
        returnValue: { status, data }
      } = login({}, userData);

      expect(status).toBe(200);
      expect(data).toBeDefined();
    });

    test("User login uncorrect password failure", () => {
      const {
        returnValue: { status, message }
      } = login({}, { ...userData, password: 1 });

      expect(status).toBe(500);
      expect(message).toBe("Invalid password");
    });

    test("User login user not found failure", () => {
      try {
        login({}, { ...userData, username: "1" });
      } catch (err) {
        expect(err.message).toBe("User not found");
      }
    });
  });
});
