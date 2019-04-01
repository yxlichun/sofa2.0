'use strict';

const async = require('async');

/**
 * 文件操作模块
 * 
 * 对复杂文件操作的封装
 */

const Files = {};

Files.replaceKeywords = (files, replaceParams, callback) => {
  const keys = Object.keys(files);
  async.each(keys, run, callback);

  function run(file, callback) {
    let str = files[file].contents.toString();
    Object.keys(replaceParams).forEach((key) => {
      str = str.replace(new RegExp(fileName.getHeadUpper(key), 'g'), fileName.getHeadUpper(replaceParams[key]))
               .replace(new RegExp(fileName.getHeadLower(key), 'g'), fileName.getHeadLower(replaceParams[key]))
               .replace(new RegExp(fileName.getFullUpper(key), 'g'), fileName.getFullUpper(replaceParams[key]))
               .replace(new RegExp(fileName.getFullLower(key), 'g'), fileName.getFullLower(replaceParams[key]))
    });
    files[file].contents = new Buffer(str);
    callback();
  }
}

const fileName = {};

fileName.getHeadUpper = function(name) {
  if (name) {
    return name.substring(0, 1).toUpperCase() + name.substring(1);
  }
  return '';
}

fileName.getHeadLower = function(name) {
  if (name) {
    return name.substring(0, 1).toLowerCase() + name.substring(1);
  }
  return '';
}

fileName.getFullUpper = function(name) {
  if (name) {
    return name.toUpperCase();
  }
  return '';
}

fileName.getFullLower = function(name) {
  if (name) {
    return name.toLowerCase();
  }
  return '';
}

module.exports = Files;
