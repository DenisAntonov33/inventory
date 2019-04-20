const { normalize } = require("../../utils");
const { Entity } = require("./_Entity_");
const { BodyParams } = require("./BodyParams");
const { Positions } = require("./Positions");

const {
  BodyParamCollection,
  PositionCollection,
} = require("../../db/collections");

const bodyParams = new BodyParams(BodyParamCollection);
const positions = new Positions(PositionCollection);

class Employees extends Entity {
  async _updateById(id, args) {
    try {
      const db = await this.getDatabase();
      const collection = db[this.collection.name];
      const item = await collection.findOne(id).exec();
      if (!item) return null;

      const _args = await this._argsHandler(args);

      if (_args["$push"] && _args["$push"]["bodyParams"]) {
        const newItem = _args["$push"]["bodyParams"];
        const isParamExist = !!item.bodyParams.find(
          e =>
            e.bodyParam === newItem.bodyParam &&
            e.bodyValue === newItem.bodyValue
        );

        if (isParamExist)
          throw new Error("bodyParam with this value already exists");
      }

      await item.update({
        ..._args,
        $set: {
          updatedAt: new Date().getTime(),
          ...(_args.$set || {}),
        },
      });

      await this.saveDatabase();

      const expandedItem = await this._expand(item);
      return expandedItem;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async _expand(item) {
    try {
      const expandedPositions = await positions._readMany(item.positions);

      const data = item.bodyParams.reduce(
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

      const allParams = await bodyParams._readMany(data.params);

      const allValues = allParams.reduce(
        (acc, curr) => [...acc, ...curr.values],
        []
      );

      const normalizedParams = normalize(allParams);
      const normalizedValues = normalize(allValues);

      const expandedItem = item.toJSON();

      return {
        ...expandedItem,
        positions: expandedPositions,
        bodyParams: expandedItem.bodyParams.map(e => ({
          bodyValue: normalizedValues[e.bodyValue],
          bodyParam: normalizedParams[e.bodyParam],
        })),
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async _expandList(items) {
    try {
      const positionsList = items.reduce(
        (acc, curr) => [...acc, ...curr.positions],
        []
      );
      const expandedPositions = await positions._readMany(positionsList);

      const data = items.reduce(
        (acc, curr) => {
          curr.bodyParams.forEach(e => {
            acc.params.push(e.bodyParam);
            acc.values.push(e.bodyValue);
          });

          return acc;
        },
        {
          params: [],
          values: [],
        }
      );

      const allParams = await bodyParams._readMany(data.params);
      const allValues = allParams.reduce(
        (acc, curr) => [...acc, ...curr.values],
        []
      );

      const normalizedPositions = normalize(expandedPositions);
      const normalizedParams = normalize(allParams);
      const normalizedValues = normalize(allValues);

      return items.map(e => ({
        ...e.toJSON(),
        positions: e.positions.map(e => normalizedPositions[e]),
        bodyParams: e.bodyParams.map(e => ({
          bodyValue: normalizedValues[e.bodyValue],
          bodyParam: normalizedParams[e.bodyParam],
        })),
      }));
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async _argsHandler(args) {
    try {
      const _args = await Object.keys(args).reduce(
        async (acc, key) => {
          switch (key) {
            case "$pull":
              break;

            default:
              acc[key] = args[key];
              break;
          }

          if (key === "$push" && args[key]["bodyParams"]) {
            const paramId = args[key]["bodyParams"]["bodyParam"];
            const valueId = args[key]["bodyParams"]["bodyValue"];

            const param = await bodyParams._readById(paramId);
            if (!param) throw new Error("param required");

            const isValueFromParam = !!param.values.find(e => e.id === valueId);
            if (!isValueFromParam) throw new Error("uncorrect value");
          }

          if (key === "$pull" && args[key]["positions"]) {
            acc["$pullAll"]["positions"] = [args[key]["positions"]];
          }

          if (key === "$pull" && args[key]["bodyParams"]) {
            acc["$pullAll"]["bodyParams"] = [args[key]["bodyParams"]];
          }

          return acc;
        },
        { $pullAll: {} }
      );

      return _args;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

exports.Employees = Employees;
