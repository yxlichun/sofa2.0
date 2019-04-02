'use strict';
const path = require('path');
const fs = require('fs');

const printer = require('./printer');

const Plugins = {};

Plugins.getPluginName = (period, orderType) => {
  return `sofa-${orderType}-${period}-plugin.js`;
}

Plugins.getUserPlugin = (period, orderType = 'after') => {
  // 在当前运行路径下，寻找sofa-plugins
  const pluginsPath = path.join(process.cwd(), 'sofa-plugins');
  return new Promise((resolve, reject) => {
    fs.access(pluginsPath, fs.constants.F_OK, (err) => {
      if (err) { // 不存在
        printer.warn('Can not find plugin files in this position');
        resolve(null);
      }
      const pluginName = Plugins.getPluginName(period, orderType);
      const pluginPath = path.join(pluginsPath, pluginName);
      fs.access(pluginPath, fs.constants.F_OK, (err) => {
        if (err) {
          resolve(null);
          return;
        }
        resolve(require(pluginPath));
      })
    });
  })
}

module.exports = Plugins;