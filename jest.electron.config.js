module.exports = {
  projects: [
    {
      runner: "@jest-runner/electron/main",
      testEnvironment: "node",
      testMatch: ["./electron/**/*.(spec|test).js"]
    }
  ]
};
