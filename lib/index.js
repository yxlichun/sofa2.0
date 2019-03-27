#!/usr/bin/env node
'use strict'

const commander = require('commander');
const project = require('./workflows/project');

commander
  .version('0.0.1')
  .option('-c, --create [type]', 'create a new project/page/component')
  .option('-r, --remove [type]', 'delete a project/page/component')
  .parse(process.argv);


if (commander.create) {
  const type = commander.create;
  if (type === 'project') {
    project.create();
  }
}
