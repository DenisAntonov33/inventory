const { normalize } = require("../../utils");

const { Factory } = require("./_Factory_");

class Positions extends Factory {
  constructor(args) {
    super(args);

    const {
      items: { entities },
    } = args;

    if (!entities) throw new Error("entities instance required");

    this.entities = entities;
  }

  async _expand(item) {
    try {
      const entitiesList = await item.entities_;
      const expandedEntities = await this.entities._expandList(entitiesList);

      return {
        ...item.toJSON(),
        entities: expandedEntities,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async _expandList(items) {
    try {
      const availableEntities = items.reduce(
        (acc, curr) => [...acc, ...curr.entities],
        []
      );

      const entitiesList = await this.entities._readMany(availableEntities);
      const normalizedEntitiesList = normalize(entitiesList);

      return items
        .map(e => ({
          ...e.toJSON(),
          entities: e.entities.map(e1 => normalizedEntitiesList[e1]),
        }))
        .sort((a, b) => a.createdAt - b.createdAt);
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
          acc["$pullAll"] = { entities: [args[key]["entities"]] };
        }

        return acc;
      }, {});

      return _args;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

exports.Positions = Positions;
