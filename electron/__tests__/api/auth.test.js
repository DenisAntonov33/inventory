const { Database } = require("../../db/Database");
const { Api } = require("../../api");

describe("Auth", () => {
  let api;

  describe("Signup", () => {
    beforeAll(async () => {
      try {
        const dbSuffix = new Date().getTime();
        const db = new Database();
        await db.createInstance(`test${dbSuffix}`);

        api = new Api(db);
      } catch (err) {
        console.log(err);
      }
    });

    test("User signup success", async () => {
      const userData = {
        name: `user${new Date().getTime()}`,
        password: "test",
        password1: "test",
      };

      const {
        returnValue: { status, data },
      } = await api.auth.signup({}, userData);

      expect(status).toBe(200);
      expect(data).toBeDefined();

      expect.assertions(2);
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
      } = await api.auth.signup({}, { ...userData, password1: "1" });
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
      await api.auth.signup({}, userData);
      const {
        returnValue: { status, message },
      } = await api.auth.signup({}, userData);
      expect(status).toBe(500);
      expect(message).toBe("Duplicate key for property username");
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
        const dbSuffix = new Date().getTime();
        const db = new Database();
        await db.createInstance(`test${dbSuffix}`);

        api = new Api(db);

        await api.auth.signup({}, userData);
      } catch (err) {
        console.log(err);
      }
    });

    test("User login success", async () => {
      expect.assertions(2);

      const {
        returnValue: { status, data },
      } = await api.auth.login({}, userData);

      expect(status).toBe(200);
      expect(data).toBeDefined();
    });

    test("User login uncorrect password failure", async () => {
      expect.assertions(2);

      const {
        returnValue: { status, message },
      } = await api.auth.login({}, { ...userData, password: 1 });

      expect(status).toBe(500);
      expect(message).toBe("Invalid password");
    });

    test("User login user not found failure", async () => {
      expect.assertions(2);

      const {
        returnValue: { status, message },
      } = await api.auth.login({}, { ...userData, name: "1" });

      expect(status).toBe(500);
      expect(message).toBe("User not found");
    });
  });
});
