const { res } = require("../services/response");
const { tokenService } = require("../services/token");
const { passwordService } = require("../services/password");
const { users } = require("../db/users");

exports.signup = function(event, arg) {
  const { username, password, password1 } = arg;

  if (password !== password1) {
    event.returnValue = res.error(500, "Password should be the same");
    return event;
  }

  const hash = passwordService.generateHash(password);

  try {
    const user = users.create({ username, password: hash });
    const token = tokenService.sign({ id: user.id });

    event.returnValue = res.success({ token });
    return event;
  } catch (err) {
    event.returnValue = res.error(500, err.message);
    return event;
  }
};

exports.login = function(event, arg) {
  const { username, password } = arg;

  const user = users.read({ username });

  if (!user) {
    event.returnValue = res.error(500, "User not found");
    return event;
  }

  const isPasswordValid = passwordService.isPasswordValid(
    password,
    user.password
  );

  if (!isPasswordValid) {
    event.returnValue = res.error(500, "Invalid password");
    return event;
  }

  const token = tokenService.sign({ id: user.id });
  event.returnValue = res.success({ token });
  return event;
};
