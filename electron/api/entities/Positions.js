const { Entity } = require("./_Entity_");

class Positions extends Entity {
  async _expand(item) {
    try {
      const entities = await item.entities_;

      return {
        ...item.toJSON(),
        entities: entities.map(e => e.toJSON()),
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
