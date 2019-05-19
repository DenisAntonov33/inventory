const { normalize } = require("../../utils");

const { Factory } = require("./_Factory_");

class Entities extends Factory {
  constructor(args) {
    super(args);

    const {
      items: { bodyParams },
    } = args;

    if (!bodyParams) throw new Error("bodyParams instance required");

    this.bodyParams = bodyParams;
  }

  async _expand(item) {
    try {
      if (!item.bodyParam) return item.toJSON();

      const bodyParam = await item.bodyParam_;
      const expandedBodyParam = await this.bodyParams._expand(bodyParam);

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

      const bodyParamsList = await this.bodyParams._readMany(
        availableBodyParams
      );
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
