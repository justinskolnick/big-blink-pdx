const camelCase = require('lodash.camelcase');
const pluralize = require('pluralize');

const dateHelper = require('../../helpers/date');
const { Labels } = require('../../helpers/labels');
const linkHelper = require('../../helpers/links');

const { titleCase } = require('../../lib/string');
const { isTruthy } = require('../../lib/util');

class Base {
  static table = null;

  static {
    this.labels = new Labels();
    this.labelKeySubstitutions = {};
  }

  static setLabelKeySubstitutions(keys = {}) {
    this.labelKeySubstitutions = {
      ...this.labelKeySubstitutions,
      ...keys,
    };
  }

  static getLabel(key, prefix = '', values = null) {
    const labelKey = this.labels.prefixLabelKey(key, prefix);

    if (labelKey in this.labelKeySubstitutions) {
      const [substituteKey, substitutePrefix] = this.labelKeySubstitutions[labelKey];

      if (this.labels.hasKey(substituteKey, substitutePrefix)) {
        return this.labels.getLabel(substituteKey, substitutePrefix);
      }
    }

    return this.labels.getLabel(key, prefix, values);
  }

  static field(fieldName, prefix = true) {
    return prefix ? [this.table.tableName(), fieldName].join('.') : fieldName;
  }

  static className() {
    return this.name.replace(/^_/, '');
  }

  static singular() {
    return titleCase(this.className()).toLowerCase();
  }

  static plural() {
    return pluralize(titleCase(this.className())).toLowerCase();
  }

  static fieldNames() {
    return this.table.fieldNames;
  }

  static fields(prefix = true) {
    const fields = Object.entries(this.fieldNames())
      .filter(([, value]) => value.select)
      .map(([key,]) => this.field(key, prefix));

    return fields;
  }

  static hasFieldAlias(fieldName) {
    return this.table.hasFieldAlias(fieldName);
  }

  static fieldAlias(fieldName) {
    return this.table.fieldAlias(fieldName);
  }

  static fieldShouldBeAdapted(fieldName) {
    return this.table.fieldShouldBeAdapted(fieldName);
  }

  static hasAdaptMethod(fieldName) {
    return this.table.hasAdaptMethod(fieldName);
  }

  static adaptMethod(fieldName) {
    const method = this.table.adaptMethod(fieldName);

    return this[method];
  }

  static fieldKey(fieldName) {
    if (this.hasFieldAlias(fieldName)) {
      const alias = this.fieldAlias(fieldName);

      return camelCase(alias);
    }

    return camelCase(fieldName);
  }

  static fieldValue(fieldName, result) {
    let value = result[fieldName];

    if (this.hasAdaptMethod(fieldName)) {
      if (value === undefined || value === null) {
        value = null;
      } else {
        const method = this.adaptMethod(fieldName);

        value = method(value);
      }
    }

    return value;
  }

  static readableBoolean(value) {
    return isTruthy(value);
  }

  static readableDate(str) {
    return dateHelper.formatDateString(str);
  }

  static readableDateRange(dateStrStart, dateStrEnd) {
    if (dateStrEnd && dateStrStart !== dateStrEnd) {
      return dateHelper.formatDateRangeString(dateStrStart, dateStrEnd);
    }

    return null;
  }

  data = {};
  links = {};

  constructor(data = {}) {
    this.data = data;

    this.configureLabels();
    this.configureLinksObject();
  }

  setData(key, value) {
    this.data[key] = value;
  }

  hasKey(key = '') {
    if (key.length) {
      return key in this.data;
    }

    return Object.keys(this.data).length > 0;
  }

  hasData(key = '') {
    if (this.hasKey(key)) {
      if (key.length) {
        return isTruthy(this.getData(key));
      }

      return Object.values(this.data).some(isTruthy);
    }

    return false;
  }

  getData(key) {
    return this.data[key];
  }

  configureLabels() {}

  configureLinksObject() {
    const key = this.constructor.linkKey;

    if (key !== null) {
      if (typeof linkHelper.links[key] === 'function') {
        if (this.hasData('id')) {
          this.setLinks({
            self: linkHelper.links[key](this.data.id),
          });
        }
      }
    }
  }

  getLabel(key, prefix = '', values = null) {
    return this.constructor.getLabel(key, prefix, values);
  }

  setLinks(links) {
    this.links = links;
  }

  hasLinks() {
    return Object.keys(this.links).length > 0;
  }

  adaptResult(result, otherValues) {
    const fields = this.constructor.fields(false);
    let adapted = fields.reduce((obj, field) => {
      if (this.constructor.fieldShouldBeAdapted(field)) {
        const key = this.constructor.fieldKey(field);
        const value = this.constructor.fieldValue(field, result);

        obj[key] = value;
      }

      return obj;
    }, {});

    if (typeof this.adaptOtherValues === 'function') {
      adapted = this.adaptOtherValues(result, adapted);
    }

    if (typeof this.adaptLabels === 'function') {
      adapted = this.adaptLabels(result, adapted);
    }

    if (this.hasLinks()) {
      adapted.links = this.links;
    }

    return {
      ...adapted,
      ...otherValues,
    };
  }

  adapt(result) {
    return this.adaptResult(result);
  }

  toPhrase(parts) {
    return parts.filter(Boolean).join(' ');
  }

  get adapted() {
    return this.adapt(this.data);
  }

  get exists() {
    return Boolean(this.data.id);
  }
}

module.exports = Base;
