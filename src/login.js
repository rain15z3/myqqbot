const request = require("./utils/request");
const logger = require("./utils/logger");
const conf = require("./conf");

module.exports = async () => {
  logger.info(`服务器地址: ${conf["post_url"]}`);

  try {
    conf["data"].version = (await request.get("/about"))["data"]["version"];
    conf["data"].session = (await request.post("/auth", {"authKey": conf["auth_key"]}))["session"];

    logger.info("mirai-api-http 版本：" + conf["data"].version);
    logger.info("mirai-api-http Session: " + conf["data"].session);

    await request.post("/verify", {"sessionKey": conf["data"].session, "qq": conf["qq"]});
    logger.success("校验Session成功");
    logger.info(`管理员: [${conf["admins"]}]`);
  } catch ($err) {
    logger.error($err);
  }
}
