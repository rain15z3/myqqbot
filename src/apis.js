import * as conf from "./conf";
import * as request from "./utils/request";

module.exports = {
  sendGroupMessage: async ($target: number, $message: string) => {
    await request.post("/sendGroupMessage", {
      "sessionKey": conf["data"].session,
      "target": $target,
      "messageChain": $message
    });
  }
}
