const nanoid = require("nanoid");
const { getInstance } = require("./index");

const collectionName = "users";

exports[collectionName] = {
  create: function(args) {
    const { username, password } = args;
    const id = nanoid(10);

    const user = {
      id,
      username,
      password
    };

    const db = getInstance();
    const usersCollection = db.getCollection(collectionName);

    const created = usersCollection.insert({ ...user });

    db.save();

    return created;
  },

  read: function(args) {
    const { username } = args;

    const db = getInstance();
    const usersCollection = db.getCollection(collectionName);

    const user = usersCollection.findOne({ username });
    if (!user) return null;

    return user;
  },

  update: function(args) {},
  delete: function(args) {}
};
