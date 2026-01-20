const camelCase = require('lodash.camelcase');
const pluralize = require('pluralize');

const dateHelper = require('../../helpers/date');
const { Labels } = require('../../helpers/labels');
const linkHelper = require('../../helpers/links');

const { snakeCase, titleCase } = require('../../lib/string');
const { isTruthy } = require('../../lib/util');

class Base {
  static primaryKeyField = 'id';

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
    return prefix ? [this.tableName, fieldName].join('.') : fieldName;
  }

  static primaryKey(prefix = true) {
    return this.field(this.primaryKeyField, prefix);
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

  static foreignKey() {
    const name = this.foreignKeyBase || this.className();
    const primaryKey = this.primaryKeyField;
    const key = [name, primaryKey].join(' ');

    return snakeCase(key);
  }

  static fields(prefix = true) {
    const fields = Object.entries(this.fieldNames)
      .filter(([, value]) => value.select)
      .map(([key,]) => this.field(key, prefix));

    return fields;
  }

  static hasAdaptField(fieldName) {
    return 'adapt' in this.fieldNames[fieldName];
  }

  static hasFieldAlias(fieldName) {
    if (this.hasAdaptField(fieldName)) {
      if ('as' in this.fieldNames[fieldName].adapt) {
        return true;
      }
    }

    return false;
  }

  static fieldAlias(fieldName) {
    return this.fieldNames[fieldName].adapt.as;
  }

  static fieldShouldBeAdapted(fieldName) {
    if (this.hasAdaptField(fieldName)) {
      if (this.fieldNames[fieldName].adapt === false) {
        return false;
      }
    }

    return true;
  }

  static hasAdaptMethod(fieldName) {
    if (this.hasAdaptField(fieldName)) {
      if ('method' in this.fieldNames[fieldName].adapt) {
        return true;
      }
    }

    return false;
  }

  static fieldMethod(fieldName) {
    return this.fieldNames[fieldName].adapt.method;
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
        value = this.fieldMethod(fieldName)(value);
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
