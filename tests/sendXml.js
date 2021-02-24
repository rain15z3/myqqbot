const conf = require("../src/conf");
const request = require("../src/utils/request");
const login = require("../src/login");
const apis = require("../src/apis");

const xml_test = `<?xml version='1.0' encoding='UTF-8' standalone='yes' ?><msg serviceID="2" templateID="1" action="web" brief="[分享] China-P" sourceMsgId="0" url="https://y.qq.com/n/yqq/song/00222Pi34ZJlkr.html" flag="0" adverSign="0" multiMsgFlag="0"><item layout="2"><audio cover="http://y.gtimg.cn/music/photo_new/T002R300x300M000004Kr0bo3ayyfH_1.jpg?max_age=2592000" src="http://122.226.161.16/amobile.music.tc.qq.com/M80000222Pi34ZJlkr.mp3?guid=1712873&amp;vkey=2B4EDCF49FFE21F599CAB423322B3EC49D119B9C8F770F1AE2E76F05BB8B0890F5D287930E2FBC6856D9124DDCBB4F7DC2CCC761AE3D196A&amp;uin=1899&amp;fromtag=66" /><title>China-P</title><summary>徐梦圆</summary></item><source name="QQ音乐" icon="https://i.gtimg.cn/open/app_icon/01/07/98/56/1101079856_100_m.png?date=20200503" url="http://web.p.qq.com/qqmpmobile/aio/app.html?id=1101079856" action="app" a_actionData="com.tencent.qqmusic" i_actionData="tencent1101079856://" appid="1101079856" /></msg>`;
const target = 934907389//926432464;

let run = async () => {
  await login();

  let response = await request.post("/sendGroupMessage", {
    "sessionKey": conf["data"].session,
    "target": target,
    "messageChain": [
      {"type": "Xml", "xml": xml_test}
      //{"type": "Plain", "text": "QAQ"}
    ]
  });

  console.log(response);
}

run();
