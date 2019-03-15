const nanoid = require("nanoid");
const { getInstance } = require("./index");

const collectionName = "bodyParams";

exports[collectionName] = {
  create: function(args) {
    try {
      const { name } = args;

      if (!name) throw new Error("Name required");

      const bodyParams = {
        id: nanoid(15),
        name,
        values: []
      };

      const db = getInstance();
      const bodyParamsCollection = db.getCollection(collectionName);
      const bodyParam = bodyParamsCollection.insert({ ...bodyParams });
      return bodyParam;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  readById: function(id) {
    try {
      if (!id) throw new Error("Id required");

      const db = getInstance();
      const bodyParamsCollection = db.getCollection(collectionName);
      const bodyParam = bodyParamsCollection.findOne({ id });
      if (!bodyParam) throw new Error("bodyParam not found");

      return bodyParam;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  updateById: function(id, args) {
    try {
      if (!id) throw new Error("Id required");

      const db = getInstance();
      const bodyParamsCollection = db.getCollection(collectionName);
      const bodyParam = bodyParamsCollection.findOne({ id });
      if (!bodyParam) throw new Error("bodyParam not found");

      const { name, value } = args;

      if (name) {
        bodyParam.name = name;
      }

      if (value) {
        bodyParam.values.push({
          id: nanoid(15),
          name: value
        });
      }

      bodyParamsCollection.update(bodyParam);
      return bodyParam;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  updateValue: function(id, args) {
    try {
      if (!id) throw new Error("Id required");

      const db = getInstance();
      const bodyParamsCollection = db.getCollection(collectionName);
      const bodyParam = bodyParamsCollection.findOne({ id });
      if (!bodyParam) throw new Error("bodyParam not found");

      const { valueId, value } = args;

      if (!valueId) throw new Error("valueId required");
      if (!value) throw new Error("value required");

      const gettedValue = bodyParam.values.find(e => e.id === valueId);
      if (!gettedValue) throw new Error("Value not found");

      gettedValue.name = value;

      return bodyParam;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  deleteById: function(id) {
    try {
      if (!id) throw new Error("Id required");

      const db = getInstance();
      const bodyParamsCollection = db.getCollection(collectionName);

      const deleted = bodyParamsCollection.findAndRemove({ id });

      return deleted;
    } catch (err) {
      throw new Error(err.message);
    }
  }
};
