const request = require("request");
const logger = require("./logger");
const conf = require("../conf");
const error_id = require("../../error_id.json");

module.exports = {
  get($url) {
    return new Promise(($resolve, $reject) => {
      request.get(conf["post_url"] + $url, ($err, $res, $body) => {
        if (!$err && $res.statusCode === 200) {
          $body = JSON.parse($body);
          $resolve($body);
        }
        $reject(`请求地址${$url}时发生错误，状态码: ${$res.statusCode}`);
      }).on("error", $e => logger.error($e));
    });
  },

  post($url, $data) {
    let options = {
      url: conf["post_url"] + $url,
      method: "POST",
      json: $data
    };

    return new Promise(($resolve, $reject) => {
      request(options, ($err, $res, $body) => {
        if (!$err && $res.statusCode === 200) {
          if ($body["code"] !== 0)
            $reject(`请求地址${$url}时返回的错误: ${error_id[$body["code"]]}`);
          $resolve($body);
        }
        $reject(`请求地址${$url}时发生错误，状态码: ${$res.statusCode}`);
      }).on("error", $e => logger.error($e));
    });
  }
}
