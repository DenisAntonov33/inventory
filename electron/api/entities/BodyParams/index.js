const { union } = require("lodash");
const { normalize } = require("../../../utils");

const { Entity } = require("../_Entity_");
const { BodyValues } = require("../BodyValues");
const { BodyValueCollection } = require("../../../db/collections");

const bodyValues = new BodyValues(BodyValueCollection);

class BodyParams extends Entity {
  async updateById(event, _args) {
    try {
      const { token, id, args } = _args;
      if (!id) throw new Error("Id required");

      const user = await this._authentification(token);

      const ids = id ? [id] : [];
      await this._authorization(user, ids);

      const item = await this._updateById(id, args);
      if (!item) throw new Error("Item not found");

      if (args["$create"]) {
        const _user = user.toJSON();
        const userBodyValues = _user.data[this.collection.link];
        const newBodyValues = item.values.map(e => e.id);
        const newUserBodyValues = union(userBodyValues, newBodyValues);

        const changeFunction = oldData => {
          oldData.data[bodyValues.collection.link] = newUserBodyValues;
          return oldData;
        };

        await user.atomicUpdate(changeFunction);
        await this.saveDatabase();
      }

      event.returnValue = this.res.success({ item });
      return event;
    } catch (err) {
      console.log(err);

      event.returnValue = this.res.error(500, err.message);
      return event;
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

  async _expandList(items) {
    try {
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
