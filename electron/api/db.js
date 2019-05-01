const { res } = require("../services/response");
const { removeDatabaseFile } = require("../db");

exports.removeDatabaseFile = async function(event) {
  try {
    await removeDatabaseFile();

    event.returnValue = res.success();
    return event;
  } catch (err) {
    event.returnValue = res.error(500, err.message);
    return event;
  }
};
