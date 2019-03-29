function flowControl(actionsMap, flow) {
  const newMap = {};
  flow.forEach((item) => {
    if (actionsMap[item]) {
      newMap[item] = actionsMap[item];
    }
  });
  return newMap;
}

module.exports = flowControl;
