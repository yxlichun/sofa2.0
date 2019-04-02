const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const async = require('async');
const Metalsmith = require('metalsmith');

const flowControl = require('../utils/flowControl');
const question = require('../utils/question');
const git = require('../utils/git');
const config = require('../config/tool.config').ComponentConfig;
const userConfigMethods = require('../utils/config');
const files = require('../utils/files');
const plugins = require('../utils/plugins');
const printer = require('../utils/printer');

const component = {};
const OPERATE_TYPE = 'component';

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
  // 在当前项目中寻找示例组件
  userConfigMethods.getConfigs().then(data => {
    const templateInfo = data.templateInfo || {};

    const baseTemplatePath = templateInfo.componentTemplateBasePath;
    const pagesPath = templateInfo.componentBasePath;

    const srcBasePath = path.join(process.cwd(), baseTemplatePath);
    const destBasePath = path.join(process.cwd(), pagesPath);

    collectParams.templateComponentPath = srcBasePath;
    collectParams.destBasePath = destBasePath;

    const match = /\w+$/.exec(srcBasePath);
    if (match) {
      collectParams.templateName = match[0];
    }

    const backupSrcBasePath = path.join(process.cwd(), 'node_modules', templateInfo.key, baseTemplatePath);

    if (fs.existsSync(srcBasePath)) {
      callback(null);
    } else if (fs.existsSync(backupSrcBasePath)){
      collectParams.templateComponentPath = backupSrcBasePath;
      callback(null);
    } else {
      printer.warn('Can not find Template in local, downloading, please wait...');
      const source = templateInfo.path;
      const dest = path.join(process.cwd(), 'node_modules', templateInfo.key);

      exec(`git clone ${source} ${dest}`, (err, stdout, stderr) => {
        collectParams.templateComponentPath = path.join(dest, baseTemplatePath);

        callback(err, stdout);
      });
    }
  })
}

function generateCode(collectParams, callback) {
  const metalsmith = Metalsmith(collectParams.templateComponentPath);
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

component.create = () => {
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

module.exports = component;
