const { res } = require("../services/response");
const { tokenService } = require("../services/token");
const { getId } = require("../services/id");
const { passwordService } = require("../services/password");
const { database } = require("../db");
const { UserCollection } = require("../db/collections");

exports.signup = async function(event, arg) {
  try {
    const { name, password, password1 } = arg;

    if (!name) throw new Error("Name is required");
    if (!password) throw new Error("Password is required");
    if (password !== password1) throw new Error("Password should be the same");

    const hash = passwordService.generateHash(password);
    const db = await database.getInstance();
    const userCollection = db[UserCollection.name];

    const user = await userCollection.insert({
      id: getId(),
      name,
      password: hash,
      createdAt: new Date().getTime(),
      data: {
        bodyValues: [],
        bodyParams: [],
        entities: [],
        positions: [],
        employees: [],
        store: [],
        history: [],
      },
    });

    await database.save();

    const token = tokenService.sign({ id: user.get("id") });

    event.returnValue = res.success({ token });
    return event;
  } catch (err) {
    event.returnValue = res.error(500, err.message);
    return event;
  }
};

exports.login = async function(event, arg) {
  try {
    const { name, password } = arg;

    const db = await database.getInstance();
    const userCollection = db[UserCollection.name];
    const user = await userCollection
      .findOne()
      .where("name")
      .eq(name)
      .exec();

    if (!user) throw new Error("User not found");

    const isPasswordValid = passwordService.isPasswordValid(
      password,
      user.password
    );
    if (!isPasswordValid) throw new Error("Invalid password");

    const token = tokenService.sign({ id: user.id });
    event.returnValue = res.success({ token });
    return event;
  } catch (err) {
    event.returnValue = res.error(500, err.message);
    return event;
  }
};

exports.me = async function(event, args) {
  try {
    const { token } = args;

    if (!token) throw new Error("Token is required");
    const { id } = tokenService.verify(token);

    const db = await database.getInstance();
    const userCollection = db[UserCollection.name];
    const user = await userCollection
      .findOne()
      .where("id")
      .eq(id)
      .exec();

    if (!user) throw new Error("User not found");

    const jsonUser = user.toJSON();

    const filteredUser = {
      name: jsonUser.name,
    };

    event.returnValue = res.success({ user: filteredUser });
    return event;
  } catch (err) {
    event.returnValue = res.error(500, err.message);
    return event;
  }
};
