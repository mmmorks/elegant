import postcss from 'postcss';
import fs from 'fs';

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node parse-css.mjs <css-file> <selector-pattern>');
  console.log('Example: node parse-css.mjs file.css "page-header"');
  process.exit(1);
}

const cssFile = args[0];
const selectorPattern = args[1];

const css = fs.readFileSync(cssFile, 'utf8');
const root = postcss.parse(css);

const matches = [];

root.walkRules(rule => {
  if (rule.selector.includes(selectorPattern)) {
    const props = {};
    rule.walkDecls(decl => {
      props[decl.prop] = decl.value;
    });
    matches.push({
      selector: rule.selector,
      properties: props
    });
  }
});

console.log(JSON.stringify(matches, null, 2));
