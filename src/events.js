const request = require("./utils/request");
const logger = require("./utils/logger");
const conf = require("./conf");
const { message } = require("./utils/logger");

event_new_request = async($message) => {
    let accept_event = {
        "sessionKey": conf["data"].session,
        "eventId": $message["eventId"],
        "fromId": $message["fromId"],
        "groupId": $message["groupId"],
        "operate": 0,
        "message": ""
    };

    switch ($message["type"]) {
        case "NewFriendRequestEvent":
            await request.post("/resp/newFriendRequestEvent", accept_event)
            logger.success(`已通过 "${$message["nick"]}" 的好友请求`);
            break;
        case "BotInvitedJoinGroupRequestEvent":
            await request.post("/resp/botInvitedJoinGroupRequestEvent", accept_event)
            logger.success(`已加入群聊 "${$message["groupName"]}"`);
            break;
    }
}

group_message = async($message) => {
    let message_chain = $message["messageChain"];
    //console.log(message_chain);

    try {
        if (message_chain[1].type == "Plain" &&
        message_chain[1].text.split("")[0] == "/") {
            let command_list = message_chain[1].text.split(" ");
            command_list[0] = command_list[0].split("/")[1];
            //logger.info("接收到命令: " + command_list[0]);
            require("./command")($message, command_list);


            // 贴贴
            if (message_chain[2] != undefined && message_chain[2].type == "At") {
                await request.post("/sendGroupMessage", {
                    "sessionKey": conf["data"].session,
                    "target": $message["sender"]["group"]["id"],
                    "messageChain": [
                        { "type": "At", "target": $message["sender"]["id"], "display": ""},
                        { "type": "Plain", "text": ` ${command_list[0]}了 `},
                        { "type": "At", "target": message_chain[2].target, "display": ""},
                        { "type": "Plain", "text": " 一下！"},
                    ]
                });
            }
        }

        // 回复贴贴
        for (chain of message_chain) {
            if (chain.type == "Quote") {
                for (plain of message_chain) {
                    if (plain.type == "Plain" && plain.text.split("")[0] == "/") {
                        await request.post("/sendGroupMessage", {
                            "sessionKey": conf["data"].session,
                            "target": $message["sender"]["group"]["id"],
                            "messageChain": [
                                { "type": "At", "target": $message["sender"]["id"], "display": ""},
                                { "type": "Plain", "text": ` ${plain.text.split("/")[1]}了 `},
                                { "type": "At", "target": chain.senderId, "display": ""},
                                { "type": "Plain", "text": " 一下！"},
                            ]
                        });
                    }
                }
            }
        }
    } catch ($err) {
        logger.error($err);
    }
}


module.exports = async($message) => {
    $message = JSON.parse($message);
    console.log($message);

    try {
        switch ($message["type"]) {
        case "NewFriendRequestEvent": // 新好友请求
            event_new_request($message);
            break;
        case "BotInvitedJoinGroupRequestEvent": // 邀请入群请求
            event_new_request($message);
            break;
        case "GroupMessage":
            group_message($message);
            break;
        }
    } catch ($err) {
        logger.error($err);
    }
}