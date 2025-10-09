const { Labels } = require('./labels');

const labels = new Labels();
const labelPrefix = 'description';

const getDetailDescription = (name, word = 'involving') => {
  const labelKey = name ? 'detail_with_name' : 'detail_without_name';

  return labels.getLabel(labelKey, labelPrefix, { name, word });
};

const getIndexDescription = (type) => {
  const labelKey = type ? 'index_with_type' : 'index_without_type';

  return labels.getLabel(labelKey, labelPrefix, { type });
};

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
