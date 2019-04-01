'use strict';

const chalk = require('chalk');

const Printer = {};

Printer.warn = (message) => {
  console.log(chalk.yellow(message));
}

Printer.error = (message) => {
  console.log(chalk.red(message));
}

module.exports = Printer;
