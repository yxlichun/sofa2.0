const fs = require('fs');
const defaultConfig = require('../config/default.sofa.config');

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

module.exports = {
  coverConfig,
}
