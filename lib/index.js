#!/usr/bin/env node
'use strict'

const commander = require('commander');
const project = require('./workflows/project');
const page = require('./workflows/page');
const component = require('./workflows/component');

commander
  .version('0.0.1')
  .option('-c, --create [type]', 'create a new project/page/component')
  .option('-r, --remove [type]', 'delete a project/page/component')
  .parse(process.argv);


switch (commander.create) {
  case 'project':
    project.create();
    break;
  case 'page':
    page.create();
    break;
  case 'component':
    component.create();
  default:
    break;
}