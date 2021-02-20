const conf = require("./conf");
const request = require("./utils/request");

module.exports = {
  sendGroupMessage: async ($target, $message) => {
    await request.post("/sendGroupMessage", {
      "sessionKey": conf["data"].session,
      "target": $target,
      "messageChain": $message
    });
  }
}
