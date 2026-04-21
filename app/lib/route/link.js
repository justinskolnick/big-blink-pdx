const { URL } = require('node:url');

class Link {
  #base = null;
  #label = null;
  #url = null;

  constructor(req, pathname, label) {
    this.setBase(req);
    this.setLabel(label);
    this.setURL(pathname);
  }

  setBase(req) {
    this.#base = `${req.protocol}://${req.host}`;
  }

  setLabel(label) {
    if (label) {
      this.#label = label;
    }
  }

  setURL(pathname) {
    if (pathname) {
      this.#url = new URL(pathname, this.#base);
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
