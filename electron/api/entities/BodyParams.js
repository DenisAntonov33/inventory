const { normalize } = require("../../utils");

const { Entity } = require("./_Entity_");
const { BodyValues } = require("./BodyValues");
const { BodyValueCollection } = require("../../db/collections");

const bodyValues = new BodyValues(BodyValueCollection);

class BodyParams extends Entity {
  async _readMany(ids) {
    try {
      const db = await this.getDatabase();
      const collection = db[this.collection.name];
      const items = await collection.find({ id: { $in: ids } }).exec();

      const availableBodyValues = items.reduce(
        (acc, curr) => [...acc, ...curr.values],
        []
      );
      const bodyValuesList = await bodyValues._readMany(availableBodyValues);
      const normalizedBodyValuesList = normalize(bodyValuesList);

      return items
        .map(e => e.toJSON())
        .map(e => ({
          ...e,
          values: e.values.map(valueId => normalizedBodyValuesList[valueId]),
        }))
        .sort((a, b) => a.createdAt - b.createdAt);
    } catch (err) {
      throw new Error(err.message);
    }
  }

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

        if (key === "$create" && args[key]["values"]) {
          const value = await bodyValues._create(args[key]["values"]);
          acc["$push"] = { values: value.id };
        }

        if (
          key === "$pull" &&
          args[key]["values"] &&
          args[key]["values"]["id"]
        ) {
          const value = await bodyValues._deleteById(args[key]["values"]["id"]);
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
