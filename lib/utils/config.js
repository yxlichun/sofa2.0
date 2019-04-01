const fs = require('fs');
const path = require('path');
const defaultConfig = require('../config/default.sofa.config');
const printer = require('../utils/printer');

function coverConfig(params, path) {
  const config = {
    ...defaultConfig,
    ...params,
  }

  const content = `module.exports=${JSON.stringify(config)}`;
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, (error) => {
      if (error) {
        reject(error);
      }
      resolve(config);
    })
  })
}

function getConfigs() {
  // 在当前运行路径下，寻找sofa.config.js
  const configPath = path.join(process.cwd(), 'sofa.config.js');
  return new Promise((resolve, reject) => {
    fs.access(configPath, fs.constants.F_OK, (err) => {
      if (err) { // 不存在
        printer.error('Can not find config file in this position');
        reject(err);
      } else {
        const config = require(configPath);
        resolve(config);
      }
    });
  })
}

module.exports = {
  coverConfig,
  getConfigs,
}
