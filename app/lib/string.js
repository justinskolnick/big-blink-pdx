const capitalize = str => str.charAt(0).toUpperCase() + str.substr(1);

const snakeCase = str => str.replace(/(?<=[a-z])(?=[A-Z])/g, ' ')
  .split(' ')
  .map(s => s.toLowerCase())
  .join('_');

const titleCase = str => str.split(' ').map(capitalize).join(' ');

const toSentence = (
  items,
  locale = 'en',
  inclusive = true
) => {
  const type = inclusive ? 'conjunction' : 'disjunction';
  const list = new Intl.ListFormat(locale, { style: 'long', type });

  return list.format(items);
};

module.exports = {
  capitalize,
  snakeCase,
  titleCase,
  toSentence,
};
