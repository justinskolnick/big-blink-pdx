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

const getMeta = (req, options = {}) => {
  const meta = { ...options };

  if (!('pageTitle' in options)) {
    if ('section' in options) {
      meta.pageTitle = getPageTitle(options.section);
    }
  }

  return {
    errors: req.flash.errors,
    warnings: req.flash.warnings,
    ...meta,
  };
};

module.exports = {
  getDetailDescription,
  getIndexDescription,
  getMeta,
  getPageTitle,
};
