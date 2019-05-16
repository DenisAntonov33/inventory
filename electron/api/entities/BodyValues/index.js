const { Entity } = require("../_Entity_");

class BodyValues extends Entity {
  constructor(collection) {
    super(collection);
    this.methods = ["updateById"];
  }
}

exports.BodyValues = BodyValues;
