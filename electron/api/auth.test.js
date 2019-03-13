const { initTestDatabase } = require("../db");
const { login, signup } = require("./auth");

describe("Auth", () => {
  beforeAll(() => {
    initTestDatabase();

    const args = {
      username: "user-test",
      password: "test",
      password1: "test"
    };

    signup({}, args);
  });

  describe("Signup", () => {
    test("User signup success", () => {
      const args = {
        username: "user999",
        password: "999",
        password1: "999"
      };

      const {
        returnValue: { status, data }
      } = signup({}, args);

      expect(status).toBe(200);
      expect(data).toBeDefined();
    });

    test("User signup same password fail", () => {
      const args = {
        username: "user999",
        password: "999",
        password1: "9991"
      };

      const {
        returnValue: { status, message }
      } = signup({}, args);

      expect(status).toBe(500);
      expect(message).toBe("Password should be the same");
    });

    test("User signup same username", () => {
      const args = {
        username: "user-test",
        password: "999",
        password1: "999"
      };

      const {
        returnValue: { status, message }
      } = signup({}, args);

      expect(status).toBe(500);
      expect(message).toBe("Duplicate key for property username: user-test");
    });
  });

  describe("Login", () => {
    test("User login success", () => {
      const args = {
        username: "user-test",
        password: "test"
      };

      const {
        returnValue: { status, data }
      } = login({}, args);

      expect(status).toBe(200);
      expect(data).toBeDefined();
    });

    test("User login uncorrect password failure", () => {
      const args = {
        username: "user-test",
        password: "test1"
      };

      const {
        returnValue: { status, message }
      } = login({}, args);

      expect(status).toBe(500);
      expect(message).toBe("Invalid password");
    });

    test("User login user not found failure", () => {
      const args = {
        username: "user-test1",
        password: "test"
      };

      const {
        returnValue: { status, message }
      } = login({}, args);

      expect(status).toBe(500);
      expect(message).toBe("User not found");
    });
  });
});
