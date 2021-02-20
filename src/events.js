const request = require("./utils/request");
const logger = require("./utils/logger");
const conf = require("./conf");

let event_new_request = async ($message) => {
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

let split_command = async ($message) => {
  if ($message === "") return -1;

  let commands = [];

  commands = $message.split(" ");
  if (commands[0] === "") // 删除多余空格
    commands.splice(0, 1);

  if (commands[0].split("")[0] === "/") {
    commands[0] = commands[0].split("/")[1];
    return commands;
  }

  return -1;
}

let group_message = async ($message) => {
  let message_chain = $message["messageChain"];
  //console.log(message_chain);

  try {
    let command_list;
    if (message_chain[1].type === "Plain" &&
      (command_list = await split_command(message_chain[1].text)) !== -1) {

      // 处理命令
      require("./command")($message, command_list);

      // 贴贴
      if (message_chain.hasOwnProperty(2) && message_chain[2].type === "At") {
        await apis.sendGroupMessage($message["sender"]["group"]["id"],
          [
            {"type": "At", "target": $message["sender"]["id"], "display": ""},
            {"type": "Plain", "text": `${command_list[0]}了 `},
            {"type": "At", "target": message_chain[2].target, "display": ""},
            {"type": "Plain", "text": " 一下！"},
          ]);
      }
    }

    // 回复贴贴
    for (let quote_index in message_chain) {
      if (message_chain.hasOwnProperty(quote_index) && message_chain[quote_index].type === "Quote") {
        for (let index = parseInt(quote_index); index < message_chain.length; index++) {
          let command_list;
          if (message_chain[index].hasOwnProperty("type") && message_chain[index].type === "Plain" &&
            (command_list = await split_command(message_chain[index].text)) !== -1) {

            let add_text = "一下";
            if (command_list.hasOwnProperty(1))
              add_text = command_list[1];

            await request.post("/sendGroupMessage", {
              "sessionKey": conf["data"].session,
              "target": $message["sender"]["group"]["id"],
              "messageChain": [
                {"type": "At", "target": $message["sender"]["id"], "display": `@${$message["sender"]["memberName"]}`},
                {"type": "Plain", "text": ` ${command_list[0]}了 `},
                {"type": "At", "target": message_chain[quote_index]["senderId"], "display": ""},
                {"type": "Plain", "text": ` ${add_text}！`},
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

module.exports = async ($message) => {
  $message = JSON.parse($message);
  console.log($message);

  try {
    switch ($message["type"]) {
      case "NewFriendRequestEvent": // 新好友请求
        await event_new_request($message);
        break;
      case "BotInvitedJoinGroupRequestEvent": // 邀请入群请求
        await event_new_request($message);
        break;
      case "GroupMessage":
        await group_message($message);
        break;
    }
  } catch ($err) {
    logger.error($err);
  }
}