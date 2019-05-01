const { res } = require("../services/response");
const { clearDatabase } = require("../db");

exports.clearDatabase = async function(event) {
  try {
    await clearDatabase();

    event.returnValue = res.success();
    return event;
  } catch (err) {
    event.returnValue = res.error(500, err.message);
    return event;
  }
};
