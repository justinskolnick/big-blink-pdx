const { Labels } = require('./labels');

const labels = new Labels();
const labelPrefix = 'description';

const getDetailDescription = (name = null, word = 'involving') => {
  const labelKey = name ? 'detail_with_name' : 'detail_without_name';
  const options = {};

  if (name) {
    options.name = name;

    if (word) {
      options.word = word;
    }
  }

  return labels.getLabel(labelKey, labelPrefix, options);
};

const getIndexDescription = (type) => {
  const labelKey = type ? 'index_with_type' : 'index_without_type';

  return labels.getLabel(labelKey, labelPrefix, { type });
};

const getSectionLinks = (req, section) => {
  const {
    baseUrl,
    originalUrl,
  } = req;
  const { title, subtitle } = section;
  let sectionLinks;

  if (!baseUrl.includes('/home')) {
    sectionLinks = {
      section: {
        label: title,
        path: baseUrl.replace('/api', ''),
      }
    };

    if (baseUrl !== originalUrl) {
      sectionLinks.detail = {
        label: subtitle,
        path: originalUrl.replace('/api', ''),
      };
    }
  }

  return sectionLinks;
};

const getPageTitle = (section) => {
  const { subtitle, title } = section;

  return [...new Set([subtitle, title])].filter(Boolean).join(' · ');
};

const getMeta = (req, options = {}) => {
  const { params } = req;
  const meta = {
    ...options,
  };

  let id;
  let section;

  if (params && 'id' in params) {
    id = Number(params.id);
  }

  if ('section' in options) {
    section = {
      ...options.section,
      id,
      links: getSectionLinks(req, options.section),
    };

    if (!('pageTitle' in options)) {
      meta.pageTitle = getPageTitle(options.section);
    }
  }

  return {
    errors: req.flash.errors,
    warnings: req.flash.warnings,
    id,
    ...meta,
    section,
  };
};

module.exports = {
  getDetailDescription,
  getIndexDescription,
  getMeta,
  getPageTitle,
};
