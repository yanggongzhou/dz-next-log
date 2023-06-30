const { cosmiconfigSync } = require('cosmiconfig')
const log4js = require("log4js");

let localConfig = {}
// 查找本地配置文件 例如： dz-next-log.config.js
const explorerSync = cosmiconfigSync('dz-next-log')
const results = explorerSync.search()

if (results && results.config) {
  localConfig = results.config
}

const ddAppenderModule = {
  configure: (config, layouts, findAppender, levels) => {
    let layout = layouts?.basicLayout;
    if (config.layout) {
      layout = layouts?.layout(config.layout.type, config.layout);
    }
    return (loggingEvent) => {
      const title = localConfig.ddTitle || "海外【SEO】告警";
      const text = layout && layout(loggingEvent);
      sendToDingding(localConfig.ddUrl, title, text);
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
        `项目名称：${config.platform}\n` +
        `告警内容：${text}\n` +
        `For more information, please visit the url, ${config.link}`
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

