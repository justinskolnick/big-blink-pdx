const { titleCase } = require('../string');

const ALLOWED_OTHER_VALUES = [
  'description',
  'page',
  'perPage',
  'view',
];

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
    this.setSection();
    this.setDetail(detail);
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

  setSection() {
    const { baseUrl } = this.#request;
    let slug;
    let title;

    if (baseUrl) {
      slug = this.getPublicPathnameFromApi(baseUrl);
      slug = slug.replace(/^\//, '');
    }

    if (slug) {
      title = titleCase(slug);
    }

    this.#section = {
      slug,
      title,
    };
  }

  setDetail(detail = null) {
    const params = this.getParams();
    const id = this.getParamsId();
    let title;

    if (detail && 'name' in detail) {
      title = detail.name;
    }

    if (id && title) {
      this.#detail = { id, title };
    }
  }

  getPublicPathnameFromApi(pathname) {
    return pathname.replace('/api', '');
  }

  getParams() {
    return this.#request.params;
  }

  getParamsId() {
    const params = this.getParams();

    if ('id' in params) {
      return Number(params.id);
    }

    return undefined;
  }

  getSectionLink() {
    const { baseUrl } = this.#request;
    let label;
    let path;

    if (baseUrl && !this.isHome()) {
      label = this.#section.title;
      path = this.getPublicPathnameFromApi(baseUrl);
    }

    return {
      label,
      path,
    };
  }

  getDetailLink() {
    const {
      baseUrl,
      originalUrl,
    } = this.#request;
    let label;
    let path;

    if (this.#detail && originalUrl !== baseUrl) {
      label = this.#detail.title;
      path = this.getPublicPathnameFromApi(originalUrl);

      return {
        label,
        path,
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
    const hasValidEntries = entries.some(([key,]) => ALLOWED_OTHER_VALUES.includes(key));

    if (hasValidEntries) {
      entries.filter(([key,]) => ALLOWED_OTHER_VALUES.includes(key)).forEach(([key, value]) => {
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

  getSection() {
    if (this.hasSection()) {
      return {
        id: this.getParamsId(),
        links: this.getSectionLinks(),
        slug: this.getSectionSlug(),
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
      id: this.getParamsId(),
      errors: this.getErrors(),
      warnings: this.getWarnings(),
      ...this.getOtherValues(),
    };

    if (isPrimary) {
      values.pageTitle = this.getPageTitle();
      values.section = this.getSection();
    }

    return values;
  }
}

module.exports = Meta;
