const { Factory } = require("./_Factory_");

class BodyValues extends Factory {
  constructor(args) {
    super(args);
    this.methods = ["updateById"];
  }
}

exports.BodyValues = BodyValues;
