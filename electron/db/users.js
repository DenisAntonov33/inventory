const nanoid = require("nanoid");
const { getInstance } = require("./index");

const collectionName = "users";

exports[collectionName] = {
  create: function(args) {
    const { username, password } = args;
    const id = nanoid(15);

    const userData = {
      id,
      username,
      password
    };

    const db = getInstance();
    const usersCollection = db.getCollection(collectionName);
    const user = usersCollection.insert({ ...userData });
    return user;
  },

  readById: function(id) {
    try {
      const db = getInstance();
      const usersCollection = db.getCollection(collectionName);
      const user = usersCollection.findOne({ id });
      if (!user) throw new Error("User not found");

      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  readByUsername: function(username) {
    try {
      const db = getInstance();
      const usersCollection = db.getCollection(collectionName);
      const user = usersCollection.findOne({ username });
      if (!user) throw new Error("User not found");

      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  updateById: function(id, args) {
    try {
      const db = getInstance();
      const usersCollection = db.getCollection(collectionName);

      if (!id) throw new Error("Id required");

      const user = usersCollection.findOne({ id });
      if (!user) throw new Error("User is not found");

      const { password } = args;
      user.password = password ? password : user.password;

      usersCollection.update(user);

      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  deleteById: function(id) {
    try {
      const db = getInstance();
      const usersCollection = db.getCollection(collectionName);

      const deleted = usersCollection.findAndRemove({ id });

      return deleted;
    } catch (err) {
      throw new Error(err.message);
    }
  }
};
