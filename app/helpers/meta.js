const pluralize = require('pluralize');

const { Labels } = require('./labels');
const { links } = require('./links');

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

const getSectionLinks = (section) => {
  const { slug, title, subtitle, id } = section;
  let sectionLinks;

  if (slug in links) {
    sectionLinks = {
      section: {
        label: title,
        path: links[slug](),
      }
    };

    if (id) {
      const key = pluralize(slug, 1);

      sectionLinks.detail = {
        label: subtitle,
        path: links[key](id),
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
  const meta = {
    ...options,
  };

  if ('section' in options) {
    meta.section.links = getSectionLinks(options.section);

    if (!('pageTitle' in options)) {
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
