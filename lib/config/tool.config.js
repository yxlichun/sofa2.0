const projectTemplates = [{
  name: 'sofa-react-template',
  key: 'sofa-template',
  path: 'https://github.com/SFTC/sofa-template.git',
}, {
  name: 'sofa-react-ts-template',
  key: 'sofa-react-ts-template',
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
    'user',
    'collectParams',
    'templates',
    'replaceKeywords',
    'generateConfigFile',
  ],
}

module.exports = {
  ProjectConfig,
};
