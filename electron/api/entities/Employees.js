const { normalize } = require("../../utils");
const { Entity } = require("./_Entity_");
const { BodyValues } = require("./BodyValues");
const { BodyParams } = require("./BodyParams");
const {
  BodyValueCollection,
  BodyParamCollection,
} = require("../../db/collections");

const bodyValues = new BodyValues(BodyValueCollection);
const bodyParams = new BodyParams(BodyParamCollection);

class Employees extends Entity {
  async _expand(item) {
    try {
      const positions = await item.positions_;

      const jsonItem = item.toJSON();
      const params = jsonItem.bodyParams || [];

      const data = params.reduce(
        (acc, curr) => {
          acc.params.push(curr.bodyParam);
          acc.values.push(curr.bodyValue);

          return acc;
        },
        {
          params: [],
          values: [],
        }
      );

      const allValues = await bodyValues._readMany(data.values);
      const allParams = await bodyParams._readMany(data.params);
      const normalizedValues = normalize(allValues);
      const normalizedParams = normalize(allParams);

      return {
        ...jsonItem,
        positions: positions.map(e => e.toJSON()),
        bodyParams: params.map(e => ({
          bodyValue: normalizedValues[e.bodyValue],
          bodyParam: normalizedParams[e.bodyParam],
        })),
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async _argsHandler(args) {
    try {
      const _args = await Object.keys(args).reduce(async (acc, key) => {
        switch (key) {
          case "$pull":
            break;

          default:
            acc[key] = args[key];
            break;
        }

        if (key === "$pull") {
          acc["$pullAll"] = { positions: [args[key]["positions"]] };
        }

        if (key === "$push" && args[key]["bodyParams"]) {
          const paramId = args[key]["bodyParams"]["bodyParam"];
          const valueId = args[key]["bodyParams"]["bodyValue"];

          const param = await bodyParams._readById(paramId);
          if (!param) args[key]["bodyParams"]["bodyParam"] = null;

          const isValueFromParam = !!param.values.find(e => e.id === valueId);
          if (!isValueFromParam) args[key]["bodyParams"]["bodyValue"] = null;
        }

        return acc;
      }, {});

      return _args;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

exports.Employees = Employees;
