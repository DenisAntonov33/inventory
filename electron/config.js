const secrets = require("./secrets.json");

exports.PSW_SECRET = secrets.password;
exports.JWT_SECRET = secrets.jwt;
