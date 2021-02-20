const request = require("./utils/request");
const logger = require("./utils/logger");
const conf = require("./conf");

module.exports = ($message, $command_list) => {
  if ($command_list[0] === "喵") {
    return send_group_message($message, "喵喵喵");
  }
}
