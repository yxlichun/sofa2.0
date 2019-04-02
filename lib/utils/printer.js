'use strict';

const chalk = require('chalk');

const Printer = {};

Printer.warn = (message) => {
  console.log(chalk.yellow(message));
}

Printer.error = (message) => {
  console.log(chalk.red(message));
}

Printer.success = (message) => {
  console.log(chalk.green(message));
}

module.exports = Printer;
