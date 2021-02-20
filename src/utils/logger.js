const chalk = require('chalk');
const getDate = require('./func/getDate');
const getCaller = require('./func/getCaller');

module.exports = print = {
  info: ($message) => {
    console.log(`[${getDate()}][${getCaller()}]${chalk.blue('[INFO]')} ${$message}`);
  },
  warn: ($message) => {
    console.warn(`[${getDate()}][${getCaller()}]${chalk.yellow(`[WARN] ` + $message)}`);
  },
  error: ($message) => {
    console.error(`[${getDate()}][${getCaller()}]${chalk.red(`[ERROR] ` + $message)}`);
    if ($message.hasOwnProperty("stack")) {
      console.error($message.stack);
    }
  },
  fatal: ($message) => {
    console.error(`[${getDate()}][${getCaller()}]${chalk.red(`[FATAL] ` + $message)}`);
    //setTimeout(() => process.exit(), 500);
  },
  success: ($message) => {
    console.log(`[${getDate()}][${getCaller()}]${chalk.blue('[INFO]')} ${chalk.green($message)}`);
  },
  message: ($message) => {
    console.log(`[${getDate()}][${getCaller()}]${chalk.blue('[MESSAGE]')} ${$message}`);
  }
}