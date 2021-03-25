const fs = require('fs');
const { camelize, templateEngine } = require('../utils');

const templates = {
  component: 'component',
  c: 'component',
  page: 'page',
  p: 'page',
  atom: 'atom',
  a: 'atom',
};

module.exports = (template, name) => {
  if (!template) {
    throw new Error(`Missing required argument: 'template'`);
  }

  if (!name) {
    throw new Error(`Missing required argument: 'name'`);
  }

  const templateName = templates[template];
  const camelizedName = camelize(name);

  switch (templateName) {
    case 'atom':
      generateComponent('component', camelizedName, 'components/UILib');
      break;
    case 'component':
      generateComponent('component', camelizedName, 'components');
      break;
    case 'page':
      generateComponent('component', `${camelizedName}Page`, 'pages');
      break;
    default:
      throw new Error(`Template '${template}' is not found`);
  }
};

function generateComponent(template, name, outputDir) {
  const destinationDir = `src/${outputDir}/${name}`;
  const files = ['index.ts', 'Foo.tsx', 'Foo.module.scss'];

  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir);
  } else {
    throw new Error(`${name} already exists`);
  }

  files.forEach((filename) => {
    const destinationPath = `src/${outputDir}/${name}/${filename.replace(
      /^Foo/,
      name,
    )}`;

    const tpl = fs.readFileSync(
      `.cli/generator/templates/${template}/${filename}`,
      {
        encoding: 'utf8',
      },
    );

    const content = templateEngine(tpl, { name });

    fs.writeFileSync(destinationPath, content);
  });
}
