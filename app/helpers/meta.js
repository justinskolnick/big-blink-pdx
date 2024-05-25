const source = 'data published by the City of Portland, Oregon';

const getDetailDescription = (name, word = 'involving') => [
  'Activity',
  name ? `${word} ${name}` : null,
  'according to lobbying',
  source,
].filter(Boolean).join(' ');

const getIndexDescription = (type) => [
  type ? `A list of ${type} involved in lobbying activity` : 'Lobbying activity',
  'according to',
  source,
].filter(Boolean).join(' ');

const getPageTitle = (section) => {
  const { subtitle, title } = section;

  return [...new Set([subtitle, title])].filter(Boolean).join(' · ');
};

module.exports = {
  getDetailDescription,
  getIndexDescription,
  getPageTitle,
};
