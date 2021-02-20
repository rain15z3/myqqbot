const request = require("./utils/request");
const logger = require("./utils/logger");
const conf = require("./conf");
const WebSocket = require("ws");

module.exports = async () => {
  logger.info(`服务器地址: ${conf["post_url"]}`);

  if (conf["heart"] !== 0) {
    setInterval(() => {
      request.get("/about").catch(() => logger.error("服务器离线"));
    }, 5000);
  }

  try {
    conf["data"].version = (await request.get("/about"))["data"]["version"];
    conf["data"].session = (await request.post("/auth", {"authKey": conf["auth_key"]}))["session"];

    logger.info("mirai-api-http 版本：" + conf["data"].version);
    logger.info("mirai-api-http Session: " + conf["data"].session);

    await request.post("/verify", {"sessionKey": conf["data"].session, "qq": conf["qq"]});
    logger.success("校验Session成功");

    logger.info("管理员: " + conf["admins"]);

    //if (conf["catch_message"]) {
    //    logger.info("消息监控: 开启");

    // WebSocket 监听事件
    const ws = new WebSocket(`${conf["ws_url"]}/all?sessionKey=${conf["data"].session}`);

    ws.on("open", () => logger.success("监听WebSocket成功"));

    ws.on("message", $message => require("./events")($message));

    ws.on("error", $err => logger.error($err));


    //}

    console.log(await request.get(`/groupList?sessionKey=${conf["data"].session}`));
    console.log(await request.get(`/friendList?sessionKey=${conf["data"].session}`));


    process.stdin.resume();
    process.on('SIGINT', async () => {
      try {
        await request.post("/release", {"sessionKey": conf["data"].session, "qq": conf["qq"]});
        logger.success("释放Session成功");
        await ws.close();
        logger.success("关闭WebSocket监听成功");
      } catch ($err) {
        logger.error($err);
      }

      process.exit();
    });
  } catch ($err) {
    logger.error($err);
  }
}
