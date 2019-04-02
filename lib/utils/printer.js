'use strict';

const chalk = require('chalk');

const Printer = {};

Printer.warn = (message) => {
  console.log(chalk.yellow(`Warn: ${message}`));
}

Printer.error = (message) => {
  console.log(chalk.red(`Error: ${message}`));
}

Printer.success = (message) => {
  console.log(chalk.green(message));
}

module.exports = Printer;
