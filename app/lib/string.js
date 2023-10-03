const snakeCase = str => str.replace(/(?<=[a-z])(?=[A-Z])/g, ' ')
  .split(' ')
  .map(s => s.toLowerCase())
  .join('_');

module.exports = {
  snakeCase,
};
