const { getDatabase } = require("../db/index");
const { login, signup } = require("./auth");

describe("Auth", () => {
  beforeAll(async () => {
    try {
      const dbSuffix = new Date().getTime();
      await getDatabase(`test${dbSuffix}`, "memory");
    } catch (err) {
      console.log(err);
    }
  });

  describe("Signup", () => {
    test("User signup success", async () => {
      expect.assertions(2);

      const userData = {
        name: `user${new Date().getTime()}`,
        password: "test",
        password1: "test",
      };

      const {
        returnValue: { status, data },
      } = await signup({}, userData);

      expect(status).toBe(200);
      expect(data).toBeDefined();
    });

    test("User signup same password fail", async () => {
      expect.assertions(2);
      const userData = {
        name: `user${new Date().getTime()}`,
        password: "test",
        password1: "test",
      };
      const {
        returnValue: { status, message },
      } = await signup({}, { ...userData, password1: "1" });
      expect(status).toBe(500);
      expect(message).toBe("Password should be the same");
    });

    test("User signup same username failure", async () => {
      expect.assertions(2);
      const userData = {
        name: `user${new Date().getTime()}`,
        password: "test",
        password1: "test",
      };
      await signup({}, userData);
      const {
        returnValue: { status, message },
      } = await signup({}, userData);
      expect(status).toBe(500);
      expect(message).toBe("Error: Duplicate key for property username");
    });
  });

  describe("Login", () => {
    const userData = {
      name: `user${new Date().getTime()}`,
      password: "psw",
      password1: "psw",
    };

    beforeAll(async () => {
      try {
        await signup({}, userData);
      } catch (err) {
        console.log(err);
      }
    });

    test("User login success", async () => {
      expect.assertions(2);

      const {
        returnValue: { status, data },
      } = await login({}, userData);

      expect(status).toBe(200);
      expect(data).toBeDefined();
    });

    test("User login uncorrect password failure", async () => {
      expect.assertions(2);

      const {
        returnValue: { status, message },
      } = await login({}, { ...userData, password: 1 });

      expect(status).toBe(500);
      expect(message).toBe("Invalid password");
    });

    test("User login user not found failure", async () => {
      expect.assertions(2);

      const {
        returnValue: { status, message },
      } = await login({}, { ...userData, name: "1" });

      expect(status).toBe(500);
      expect(message).toBe("User not found");
    });
  });
});
