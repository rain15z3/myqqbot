const conf = require("../config.json");

module.exports = {
  "data": {
    version: 0,
    session: ""
  },
  "post_url": `${conf["protocol"]}://${conf["server"]}:${conf["port"]}`,
  "ws_url": `ws://${conf["server"]}:${conf["port"]}`,
  "auth_key": conf["auth_key"],
  "qq": conf["qq"],
  "catch_message": conf["catch_message"],
  "admins": conf["admins"],
  "heart": conf["heart"]
}