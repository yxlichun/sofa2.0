'use strict'
const path = require('path');

function findRoot(projectName) {
  return path.join(process.cwd(), projectName);
}

module.exports = findRoot;
