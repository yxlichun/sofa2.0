'use strict'

const inquirer = require('inquirer');

const question = {};

question.askQuestions = (questionsArr) => {
  return inquirer.prompt(questionsArr);
}

question.input = (message, name) => {
  return inquirer.prompt([{
    type: 'input',
    message: message,
    name: name,
  }])
}

module.exports = question;
