const { Labels } = require('../helpers/labels');

class Role {
  static allOptions = [];

  static isValidOption(value) {
    return this.allOptions.includes(value);
  }

  static parseList(values) {
    return values?.split(',').filter(Boolean);
  }

  static getList(values) {
    const list = this.parseList(values);

    return this.options().filter(role => list?.includes(role));
  }

  static getOptions(values) {
    const list = this.parseList(values);

    return this.options().reduce((all, option) => {
      all[option] = list?.includes(option);

      return all;
    }, {});
  }

  static options() {
    return this.allOptions;
  }

  labels = null;
  labelPrefix = null;

  role = null;

  collections = {};

  filterRole = false;

  constructor(role = null) {
    this.labels = new Labels();

    if (this.constructor.isValidOption(role)) {
      this.role = role;
    }

    this.initCollections();
  }

  configCollections() {
    return [];
  }

  initCollections() {
    const collections = this.configCollections();
    this.collections = new Map();

    collections.forEach(collection => {
      this.collections.set(collection, null);
    });
  }

  getLabel(key, prefix) {
    return this.labels.getLabel(key, prefix);
  }

  hasCollection(collection) {
    return this.collections.has(collection);
  }

  setCollection(collection, data) {
    if (this.hasCollection(collection)) {
      this.collections.set(collection, data);
    }
  }

  getCollection(collection) {
    if (this.hasCollection(collection)) {
      return this.collections.get(collection);
    }

    return null;
  }

  get hasRole() {
    return this.role !== null;
  }

  get role() {
    return this.role;
  }

  toObject() {
    if (this.hasRole) {
      const collections = Object.fromEntries(this.collections);

      return {
        filterRole: this.filterRole,
        label: this.getLabel(`as_${this.role}`, this.labelPrefix),
        role: this.role,
        ...collections,
      };
    }

    return null;
  }
}

module.exports = Role;
