const { URL } = require('node:url');

const URL_BASE = process.env.ROOT_URL;

class Link {
  #label = null;
  #url = null;

  constructor(pathname, label) {
    this.setLabel(label);
    this.setURL(pathname);
  }

  setLabel(label) {
    if (label) {
      this.#label = label;
    }
  }

  setURL(pathname) {
    if (pathname) {
      this.#url = new URL(pathname, URL_BASE);
    }
  }

  hasLabel() {
    return this.#label !== null;
  }

  hasUrl() {
    return this.#url !== null;
  }

  getLabel() {
    if (this.hasLabel()) {
      return this.#label;
    }

    return undefined;
  }

  getPathname() {
    if (this.hasUrl()) {
      return this.#url.pathname;
    }

    return undefined;
  }

  getParams() {
    if (this.hasUrl()) {
      if (this.#url.searchParams.size > 0) {
        const params = Object.fromEntries(this.#url.searchParams);

        Object.keys(params).forEach(key => {
          if (!isNaN(params[key])) {
            params[key] = Number(params[key]);
          }
        });

        return params;
      }
    }

    return undefined;
  }

  toObject() {
    return {
      label: this.getLabel(),
      pathname: this.getPathname(),
      params: this.getParams(),
    };
  }
}

module.exports = Link;
