export const toSentence = (
  items: string[],
  locale = 'en',
  inclusive = true
) => {
  const type = inclusive ? 'conjunction' : 'disjunction';
  const list = new Intl.ListFormat(locale, { style: 'long', type });

  return list.format(items);
};
