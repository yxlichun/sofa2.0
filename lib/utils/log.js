'use strict';

/**
 * 日志模块
 * 
 * 用于向持久化层写入操作日志数据
 */

const Log = {};

Log.addOperateLog = (info, params, user) => {
  return new Promise((resolve) => {
    console.log('record: ', info);
    resolve(true);
  });
}

module.exports = Log;
