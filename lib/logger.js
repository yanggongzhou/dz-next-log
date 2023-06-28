const { cosmiconfigSync } = require('cosmiconfig')
const log4js = require("log4js");

let config = {}

const explorerSync = cosmiconfigSync('dz-next-log')
const results = explorerSync.search()

if (results && results.config) {
  config = results.config
}

const ddAppenderModule = {
  configure: (config, layouts, findAppender, levels) => {
    let layout = layouts?.basicLayout;
    if (config.layout) {
      layout = layouts?.layout(config.layout.type, config.layout);
    }
    return (loggingEvent) => {
      const title = config.title || "海外【SEO】告警";
      const text = layout && layout(loggingEvent);
      sendToDingding(config.hookUrl, title, text);
    };
  },
};

/*
* 发送钉钉接口
* */
function sendToDingding(dingding, title, text) {
  const textContent = {
    "msgtype": "text",
    "text": {
      "content": `${title}\n` +
        `项目名称：NovelRead\n` +
        `告警内容：${text}\n` +
        "For more information, please visit the url, https://www.novelread.com"
    }
  };

  fetch(dingding, {
    method: "POST",
    headers: new Headers({
      'Content-Type': "application/json"
    }),
    body: JSON.stringify(textContent)
  }).then(response => {
    response.json().catch(e => { console.error(e + '') })
  }).catch(e => { console.error(e + '') })
}

const isProduction = true;

log4js.configure({
  appenders: {
    logInfo: {
      type: "dateFile",
      filename: "logs/info",
      alwaysIncludePattern: true,
      pattern: "yyyy-MM-dd-hh.log",
      encoding: "utf-8",
      maxLogSize: 10240, // 文件最大存储空间
      numBackups: 168,
    },
    logError: {
      type: "dateFile",
      filename: "logs/error",
      alwaysIncludePattern: true,
      pattern: "yyyy-MM-dd-hh.log",
      encoding: "utf-8",
      maxLogSize: 10240, // 文件最大存储空间
      numBackups: 168,
    },
    logConsole: {
      type: "console",
    },
    dingding: {
      type: ddAppenderModule,
      hookUrl: 'https://oapi.dingtalk.com/robot/send?access_token=7667bee5471210ebbbf0b201d20b82146b9d8a61d382315e6d6704c28d497e50',
      title: '海外【SEO】告警',
    }
  },
  categories: {
    default: { appenders: ["logInfo"], level: "info" },
    info: { appenders: ["logInfo"], level: "info" },
    error: { appenders: ["logInfo", "logError"], level: "error" },
    console: { appenders: ["logConsole"], level: log4js.levels.ALL.levelStr },
    dingding: { appenders: ['logInfo', 'dingding', 'logError'], level: 'error' }
  },
});

const logger = {
  info: function (msg, ...args) {
    const logger = log4js.getLogger(isProduction ? "info" : "console")
    logger.info(msg, ...args)
  },
  warn: function (msg, ...args) {
    const logger = log4js.getLogger(isProduction ? "error" : "console")
    logger.error(msg, ...args)
  },
  error: function (msg, ...args) {
    const logger = log4js.getLogger(isProduction ? "dingding" : "console")
    logger.error(msg, ...args)
  }
}

module.exports = logger;

