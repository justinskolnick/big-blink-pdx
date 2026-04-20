const { titleCase } = require('../string');
const { Labels } = require('../../helpers/labels');

const Link = require('./link');

const ALLOWED_OTHER_PROPERTIES = [
  'description',
  'id',
  'page',
  'perPage',
  'view',
];

const labels = new Labels();

class Meta {
  #request = null;

  #detail = null;
  #errors = [];
  #links = null;
  #section = null;
  #warnings = [];

  #customPageTitle = null;

  #otherValues;

  constructor(request, detail = null) {
    const { flash } = request;

    this.setRequest(request);
    this.setDetail(detail);
    this.setSection();
    this.setLinks();

    if (flash.errors.length) {
      this.setErrors(flash.errors);
    }

    if (flash.warnings.length) {
      this.setWarnings(flash.warnings);
    }
  }

  setRequest(request) {
    this.#request = request;
  }

  setDetail(detail = null) {
    const id = this.getParamsId();
    let title;

    if (detail) {
      if ('name' in detail) {
        title = detail.name;
      } else if ('title' in detail) {
        title = detail.title;
      }
    }

    if (id || title) {
      this.#detail = { id, title };
    }
  }

  setSection() {
    const { baseUrl } = this.#request;
    let slug;
    let subtitle;
    let title;

    if (baseUrl) {
      slug = this.getPublicPathnameFromApi(baseUrl);
      slug = slug.replace(/^\//, '');
    }

    if (slug) {
      if (labels.hasKey(slug, 'section')) {
        title = labels.getLabel(slug, 'section');
      } else {
        title = titleCase(slug);
      }
    }

    if (title && this.hasDetails()) {
      subtitle = this.#detail.title;
    }

    this.#section = {
      slug,
      subtitle,
      title,
    };
  }

  getPublicPathnameFromApi(pathname) {
    return pathname.replace('/api', '');
  }

  getParamsId() {
    const params = this.#request.params;

    if ('id' in params) {
      return Number(params.id);
    }

    return undefined;
  }

  getSectionLink() {
    const { baseUrl } = this.#request;

    if (baseUrl && !this.isHome()) {
      const pathname = this.getPublicPathnameFromApi(baseUrl);
      const link = new Link(pathname, this.#section.title);
      const linkObj = link.toObject();

      return {
        label: linkObj.label,
        path: linkObj.pathname,
      };
    }

    return {
      label: undefined,
      path: undefined,
    };
  }

  getDetailLink() {
    const {
      baseUrl,
      originalUrl,
    } = this.#request;

    if (this.hasDetails() && originalUrl !== baseUrl) {
      const pathname = this.getPublicPathnameFromApi(originalUrl);

      const link = new Link(pathname, this.#detail.title);
      const linkObj = link.toObject();

      return {
        label: linkObj.label,
        path: linkObj.pathname,
      };
    }

    return undefined;
  }

  setLinks() {
    this.#links = {
      section: this.getSectionLink(),
      detail: this.getDetailLink(),
    };
  }

  setErrors(errors) {
    if (errors !== null) {
      this.#errors = errors;
    }
  }

  setError(error) {
    this.#errors.push(error);
  }

  setWarnings(warnings) {
    if (warnings !== null) {
      this.#warnings = warnings;
    }
  }

  setWarning(warning) {
    this.#warnings.push(warning);
  }

  setCustomPageTitle(value) {
    this.#customPageTitle = value;
  }

  setOtherValues(values) {
    const otherValues = {};
    const entries = Object.entries(values);
    const hasValidEntries = entries.some(([key,]) => ALLOWED_OTHER_PROPERTIES.includes(key));

    if (hasValidEntries) {
      entries.filter(([key,]) => ALLOWED_OTHER_PROPERTIES.includes(key)).forEach(([key, value]) => {
        otherValues[key] = value;
      });

      this.#otherValues = otherValues;
    }
  }

  isHome() {
    return this.#request.baseUrl?.includes('/home');
  }

  hasSection() {
    return this.#section !== null && typeof this.#section === 'object';
  }

  hasDetails() {
    return this.#detail !== null && typeof this.#detail === 'object';
  }

  hasCustomPageTitle() {
    return this.#customPageTitle !== null && typeof this.#customPageTitle === 'string';
  }

  getPageTitle() {
    if (this.hasCustomPageTitle()) {
      return this.#customPageTitle;
    }

    if (!this.isHome()) {
      let title;
      let subtitle;

      if (this.hasSection()) {
        title = this.getSectionTitle();
      }

      if (this.hasDetails()) {
        subtitle = this.#detail.title;
      }

      if (title) {
        return [...new Set([subtitle, title])].filter(Boolean).join(' · ');
      }
    }

    return undefined;
  }

  getSectionLinks() {
    if (this.hasSection()) {
      return this.#links;
    }

    return undefined;
  }

  getSectionSlug() {
    if (this.hasSection() && !this.isHome()) {
      return this.#section.slug;
    }

    return undefined;
  }

  getSectionTitle() {
    if (this.hasSection() && !this.isHome()) {
      return this.#section.title;
    }

    return undefined;
  }

  getSectionSubtitle() {
    if (this.hasSection() && !this.isHome()) {
      return this.#section.subtitle;
    }

    return undefined;
  }

  getSection() {
    if (this.hasSection()) {
      return {
        id: this.getParamsId(),
        links: this.getSectionLinks(),
        slug: this.getSectionSlug(),
        subtitle: this.getSectionSubtitle(),
        title: this.getSectionTitle(),
      };
    }

    return undefined;
  }

  getErrors() {
    return this.#errors;
  }

  getWarnings() {
    return this.#warnings;
  }

  getOtherValues() {
    return this.#otherValues;
  }

  toObject(isPrimary = true) {
    const values = {
      errors: this.getErrors(),
      warnings: this.getWarnings(),
      ...this.getOtherValues(),
    };

    if (isPrimary || this.isHome()) {
      values.pageTitle = this.getPageTitle();
    }

    if (this.isHome()) {
      values.section = {};
    } else if (isPrimary) {
      values.id = values.id || this.getParamsId();
      values.section = this.getSection();
    }

    return values;
  }
}

module.exports = Meta;
