const apis = require("./apis");

let send_group_message = async ($object, $message) => {
  return apis.sendGroupMessage(
    $object["sender"]["group"]["id"],
    [{"type": "Plain", "text": $message}]);
}

module.exports = ($message, $command_list) => {
  if ($command_list[0] === "喵") {
    return send_group_message($message, "喵喵喵");
  }
}
