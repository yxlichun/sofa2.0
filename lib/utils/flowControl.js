const Log = require('../utils/log');

function flowControl(actionsMap, flow) {
  const newMap = {};
  flow.forEach((item) => {
    if (actionsMap[item]) {
      newMap[item] = actionsMap[item];
    }
  });

  // 在流程的结尾记录操作日志信息
  newMap.log = [flow[flow.length - 1], ({ collectParams, user }, callback) => {
    Log.addOperateLog(
      `${collectParams.operateAction} ${collectParams.operateType} success`,
      collectParams,
      user,
    ).then(() => {
      callback(null);
    })
  }];

  return newMap;
}

module.exports = flowControl;
