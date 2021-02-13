const request = require("./utils/request");
const logger = require("./utils/logger");
const conf = require("./conf");

module.exports = async($message, $command_list) => {
    if ($command_list[0] == "喵") {
        await request.post("/sendGroupMessage", {
            "sessionKey": conf["data"].session,
            "target": $message["sender"]["group"]["id"],
            "messageChain": [
                { "type": "Plain", "text": "喵喵喵"},
            ]
        });
    }
}
