'use strict';

const DbOperate = require('./mongodb');

/**
 * 日志模块
 * 
 * 用于向持久化层写入操作日志数据
 */

const Log = {};

Log.addOperateLog = (info, params, user) => {
  return DbOperate.insertLog(info, user);
}

module.exports = Log;
