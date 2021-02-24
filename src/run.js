const request = require("./utils/request");
const logger = require("./utils/logger");
const conf = require("./conf");
const login = require("./login");
const WebSocket = require("ws");

module.exports = async () => {
  setInterval(() => {
    request.get("/about").catch(() => logger.error("服务器离线"));
  }, 5000);

  try {
    await login();

    // WebSocket 监听事件
    const ws = new WebSocket(`${conf["ws_url"]}/all?sessionKey=${conf["data"].session}`);
    ws.on("open", () => logger.success("监听WebSocket成功"));
    ws.on("message", $message => require("./events")($message));
    ws.on("error", $err => logger.error($err));

    // 获取列表
    console.log(await request.get(`/groupList?sessionKey=${conf["data"].session}`));
    console.log(await request.get(`/friendList?sessionKey=${conf["data"].session}`));

    // 退出前清理
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
