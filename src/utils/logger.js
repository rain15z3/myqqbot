const chalk = require('chalk');
const getDate = require('./func/getDate');

module.exports = print = {
    info: ($message) => {
        let date = getDate();
        console.log(`[${date}]${chalk.blue('[INFO]')} ${$message}`);
    },
    warn: ($message) => {
        let date = getDate();
        console.warn(`[${date}]${chalk.yellow(`[WARN] ` + $message)}`);
    },
    error: ($message) => {
        let date = getDate();
        console.error(`[${date}]${chalk.red(`[ERROR] ` + $message)}`);
    },
    fatal: ($message) => {
        let date = getDate();
        console.error(`[${date}]${chalk.red(`[FATAL] ` + $message)}`);
        //setTimeout(() => process.exit(), 500);
    },
    success: ($message) => {
        let date = getDate();
        console.log(`[${date}]${chalk.blue('[INFO]')} ${chalk.green($message)}`);
    },
    message: ($message) => {
        let date = getDate();
        console.log(`[${date}]${chalk.blue('[MESSAGE]')} ${$message}`);
    }
}