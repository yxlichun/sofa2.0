const async = require('async');

const question = require('../utils/question');
const git = require('../utils/git');
const config = require('../config/tool.config').ProjectConfig;

const project = {};

function getUserInfo(callback) {
  git(['user', 'email'], (err, result) => {
    callback(err, result);
  });
}

function collectParams(callback) {
  question.askQuestions(config.collectParams)
    .then(result => {
      callback(null, result);
    });
}

project.create = () => {
  async.parallel(
    {
      user: getUserInfo, 
      collectParams,
    },
    (err, results) => {
      console.log(results);
    },
  );
}

module.exports = project;