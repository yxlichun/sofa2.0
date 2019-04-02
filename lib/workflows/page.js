const path = require('path');
const fs = require('fs');

const async = require('async');
const Metalsmith = require('metalsmith');

const flowControl = require('../utils/flowControl');
const question = require('../utils/question');
const git = require('../utils/git');
const config = require('../config/tool.config').PageConfig;
const userConfigMethods = require('../utils/config');
const files = require('../utils/files');
const plugins = require('../utils/plugins');
const printer = require('../utils/printer');

const page = {};
const OPERATE_TYPE = 'page';

function getUserInfo(callback) {
  git(['user', 'email'], callback);
}

function collectParams(callback) {
  question.askQuestions(config.collectParams)
    .then(result => {
      result.operateAction = 'create';
      result.operateType = OPERATE_TYPE;
      callback(null, result);
    });
}

function selectTemplate(collectParams, callback) {
  const templates = [];
  userConfigMethods.getConfigs().then(data => {
    const baseTemplatePath = data.templateInfo && data.templateInfo.pageTemplateBasePath;
    const pagesPath = data.templateInfo && data.templateInfo.pageBasePath;

    const srcBasePath = path.join(process.cwd(), baseTemplatePath);
    const destBasePath = path.join(process.cwd(), pagesPath);

    fs.readdir(srcBasePath, (err, files) => {
      if (err) {
        callback(err);
        return;
      }
      files.forEach((file) => {
        const stat = fs.lstatSync(path.join(srcBasePath, file));
        if (stat.isDirectory() === true) {
          templates.push(file);
        }
      });

      question.askQuestions([{ // 模板选择
        type: 'list',
        message: 'Please choose a template:',
        choices: templates,
        name: 'templateName',
        default: templates[0],
      }]).then(({ templateName }) => {
        collectParams.templateName = templateName;
        collectParams.templatePagePath = path.join(srcBasePath, templateName);
        collectParams.destBasePath = destBasePath;
        callback(null);
      })
    })
  })
}

function generateCode(collectParams, callback) {
  const metalsmith = Metalsmith(collectParams.templatePagePath);
  const metadata = metalsmith.metadata();

  metadata[collectParams.templateName] = collectParams.name;

  metalsmith.clean(false)
    .use((filesMap, metalsmith, callback) => files.replaceKeywords(filesMap, metalsmith.metadata(), callback))
    .source('.')
    .destination(path.join(collectParams.destBasePath, collectParams.name))
    .build((err, files) => {
      callback(err);
    });
}

function afterGenerateCode(data, callback) {
  plugins.getUserPlugin('generateCode').then((plugin) => {
    if (plugin) {
      plugin(data, callback);
    } else {
      callback(null);
    }
  });
}

page.create = () => {
  async.auto(
    flowControl(
      {
        user: getUserInfo, 
        collectParams,
        selectTemplate: ['collectParams', ({ collectParams }, callback) => {
          selectTemplate(collectParams, callback);
        }],
        generateCode: ['selectTemplate', ({ collectParams }, callback) => {
          generateCode(collectParams, callback);
        }],
        afterGenerateCode: ['generateCode', afterGenerateCode]
      },
      config.flow,
    ),
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        printer.success('Done!');
      }
    },
  );
}

module.exports = page;
