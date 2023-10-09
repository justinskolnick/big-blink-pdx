const snakeCase = str => str.replace(/(?<=[a-z])(?=[A-Z])/g, ' ')
  .split(' ')
  .map(s => s.toLowerCase())
  .join('_');

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
  snakeCase,
  toSentence,
};
