const secrets = require("../config");
const jwt = require("jsonwebtoken");

const secret = secrets.JWT_SECRET;

exports.tokenService = {
  sign: function(args) {
    const { id } = args;
    return jwt.sign({ id }, secret);
  },
  verify: function(token) {
    return jwt.verify(token, secret);
  }
};
