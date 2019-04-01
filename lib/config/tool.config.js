const projectTemplates = [{
  name: 'sofa-react-template',
  key: 'sofa-template',
  pageTemplateBasePath: '/src/containers',
  pageBasePath: '/src/containers',
  path: 'https://github.com/SFTC/sofa-template.git',
}, {
  name: 'sofa-react-ts-template',
  key: 'sofa-react-ts-template',
  pageTemplateBasePath: '/src/containers',
  pageBasePath: '/src/containers',
  path: 'https://github.com/yxlichun/sofa-ts-template.git',
}];

const ProjectConfig = {
  projectTemplates,
  collectParams: [
    { // 名字
      message: 'Please input the name of the new Project',
      name: 'name',
      type: 'input',
    }, { // 模板选择
      type: 'list',
      message: 'Please choose a template:',
      choices: projectTemplates,
      name: 'templateName',
      default: 'sofa-react-template',
    }
  ],
  flow: [
    'user', // 不可移除
    'collectParams', // 不可移除
    'templates', // 不可移除
    'replaceKeywords',
    'generateConfigFile',
  ],
}

const PageConfig = {
  collectParams: [
    { // 名字
      message: 'Please input the key name of the new Page',
      name: 'name',
      type: 'input',
    }, { // 中文名字
      message: 'Please input the Chinese Name of the new Page',
      name: 'chineseName',
      type: 'input',
    }, { // 父级页面
      message: 'Does it has a parent Name? if have, please input the parent key',
      name: 'parent',
      type: 'input',
      default: false,
    }
  ],
  flow: [
    'user', // 不可移除
    'collectParams', // 不可移除
    'selectTemplate', // 不可移除
    'generateCode',
  ],
}

module.exports = {
  ProjectConfig,
  PageConfig,
};
