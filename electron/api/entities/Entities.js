const { normalize } = require("../../utils");

const { Entity } = require("./_Entity_");
const { BodyParams } = require("./BodyParams");

const { BodyParamCollection } = require("../../db/collections");

const bodyParams = new BodyParams(BodyParamCollection);

class Entities extends Entity {
  async _expand(item) {
    try {
      const bodyParam = await item.bodyParam_;
      const expandedBodyParam = await bodyParams._expand(bodyParam);

      return {
        ...item.toJSON(),
        bodyParam: expandedBodyParam,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async _expandList(items) {
    try {
      const availableBodyParams = items.reduce(
        (acc, curr) => [...acc, curr.bodyParam],
        []
      );

      const bodyParamsList = await bodyParams._readMany(availableBodyParams);
      const normalizedBodyParamsList = normalize(bodyParamsList);

      return items
        .map(e => ({
          ...e.toJSON(),
          bodyParam: normalizedBodyParamsList[e.bodyParam],
        }))
        .sort((a, b) => a.createdAt - b.createdAt);
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

exports.Entities = Entities;
