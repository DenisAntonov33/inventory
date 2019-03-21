const generate = require("nanoid/generate");

exports.getId = function() {
  return generate("1234567890abcdefghijklmopqrstuvwxyz", 10);
};
