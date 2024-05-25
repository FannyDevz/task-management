/** @type {import('prettier').Config} */
module.exports = {
  endOfLine: 'lf',
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: 'es6',
  importOrderParserPlugins: ['jsx', 'classProperties', 'decorators-legacy'],
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
};
