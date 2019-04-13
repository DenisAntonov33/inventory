const { Entity } = require("./_Entity_");

class Entities extends Entity {
  async _expand(item) {
    try {
      const bodyParam = (await item.bodyParam_) || null;
      return {
        ...item.toJSON(),
        bodyParam: bodyParam ? bodyParam.toJSON() : null,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

exports.Entities = Entities;
