const secrets = require("../config");
const crypto = require("crypto-js");

const key = secrets.PSW_SECRET;

exports.passwordService = {
  generateHash: function(password) {
    return crypto.HmacSHA1(password, key).toString();
  },
  isPasswordValid: function(password, hashedPassword) {
    return crypto.HmacSHA1(password, key).toString() === hashedPassword;
  }
};
