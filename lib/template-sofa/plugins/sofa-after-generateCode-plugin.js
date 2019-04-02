'use strict';
const path = require('path');
const fs = require('fs');

function modifyOutFile(data, callback) {
  const menuPath = path.join(process.cwd(), '/src/config/menu.conf.js');
  fs.writeFile(menuPath, 'haha', (err) => {
    callback(err);
  });
}

module.exports = modifyOutFile;
