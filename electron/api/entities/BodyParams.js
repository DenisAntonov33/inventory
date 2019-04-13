const { Entity } = require("./_Entity_");
const { BodyValues } = require("./BodyValues");
const { BodyValueCollection } = require("../../db/collections");

const bodyValues = new BodyValues(BodyValueCollection);

class BodyParams extends Entity {
  async _expand(item) {
    try {
      const values = (await item.values_) || [];
      return { ...item.toJSON(), values: values.map(e => e.toJSON()) };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async _argsHandler(args) {
    try {
      return await Object.keys(args).reduce(async (acc, key) => {
        switch (key) {
          case "$create":
          case "$pull":
            break;

          default:
            acc[key] = args[key];
            break;
        }

        if (key === "$create") {
          const value = await bodyValues._create(args[key]["value"]);
          acc["$push"] = { values: value.id };
        }

        if (key === "$pull") {
          const value = await bodyValues._deleteById(args[key]["values"]);
          acc["$pullAll"] = { values: [value.id] };
        }

        return acc;
      }, {});
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

exports.BodyParams = BodyParams;
