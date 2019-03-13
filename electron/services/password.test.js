const { passwordService } = require("./password");

describe("Password", () => {
  test("Passwords should be the same", () => {
    const password = "test";
    const hashedPassword = passwordService.generateHash(password);

    const isValid = passwordService.isPasswordValid(password, hashedPassword);
    expect(isValid).toBeTruthy();
  });
});
