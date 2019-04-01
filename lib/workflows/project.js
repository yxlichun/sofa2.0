const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

const async = require('async');
const chalkAnimation = require('chalk-animation');

const flowControl = require('../utils/flowControl');
const question = require('../utils/question');
const git = require('../utils/git');
const config = require('../config/tool.config').ProjectConfig;
const getRootPath = require('../utils/findRoot');
const userConfigMethods = require('../utils/config');

const project = {};

function getUserInfo(callback) {
  git(['user', 'email'], (err, result) => {
    callback(err, result);
  });
}

function collectParams(callback) {
  question.askQuestions(config.collectParams)
    .then(result => {
      result.operateAction = 'create';
      result.operateType = 'project';
      callback(null, result);
    });
}

function getTemplates(source, dest, callback) {
  let str = 'Code is Cloning';
  const rainbow = chalkAnimation.rainbow(str);
  const timer = setInterval(() => {
    rainbow.replace(str += '.');
  }, 1000);

  exec(`git clone ${source} ${dest}`, (err, stdout, stderr) => {
    clearInterval(timer);
    callback(err, stdout);
  });
}

function replaceKeywords(collectParams, callback) {
  const projectName = collectParams.name;
  const README = path.join(getRootPath(projectName), 'README.md');
  const package = path.join(getRootPath(projectName), 'package.json');

  [ README, package ].forEach((path) => {
    if (fs.existsSync(path)) { 
      let file = fs.readFileSync(path, 'utf-8');
      file = file.replace(new RegExp(collectParams.templateInfo.key, 'g'), projectName);
      fs.writeFileSync(path, file);
    }
  });

  callback(null);
}

function generateConfigFile(collectParams, callback) {
  const projectName = collectParams.name;
  const sofaConfig = path.join(getRootPath(projectName), 'sofa.config.js');
  userConfigMethods.coverConfig(collectParams, sofaConfig).then(() => {
    callback(null);
  });
}

function installDependencies(collectParams, callback) {
  const projectName = collectParams.name;
  const projectPath = getRootPath(projectName);

  let str = 'Installing Dependencies';
  const rainbow = chalkAnimation.rainbow(str);
  const timer = setInterval(() => {
    rainbow.replace(str += '.');
  }, 1000);

  exec('npm install', { cwd: projectPath }, (err, stdout, stderr) => {
    console.log(`stdout: ${stdout}`);
    clearTimeout(timer);
    callback(err);
  });
}


project.create = () => {
  async.auto(
    flowControl(
      {
        user: getUserInfo, 
        collectParams,
        templates: ['collectParams', ({ collectParams }, callback) => {
          const dest = getRootPath(collectParams.name);
          const templateInfo = config.projectTemplates.find((item) => {
            return item.name === collectParams.templateName;
          });
          collectParams.templateInfo = templateInfo;
          const source = templateInfo.path;
          getTemplates(source, dest, callback);
        }],
        replaceKeywords: ['templates', ({ collectParams }, callback) => {
          replaceKeywords(collectParams, callback);
        }],
        generateConfigFile: ['templates', ({ collectParams }, callback) => {
          generateConfigFile(collectParams, callback);
        }],
        installDependencies: ['templates', ({ collectParams }, callback) => {
          installDependencies(collectParams, callback);
        }],
      },
      config.flow,
    ),
    (err, results) => {
      console.log(err, results);
    },
  );
}

module.exports = project;
