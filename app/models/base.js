const camelCase = require('lodash.camelcase');

const dateHelper = require('../helpers/date');
const linkHelper = require('../helpers/links');

class Base {
  static primaryKeyField = 'id';

  static baseLabels = {
    /* eslint-disable camelcase */
    appearances: 'Appearances',
    incident_first: 'First appearance',
    incident_last: 'Most recent appearance',
    incident_percentage: 'Share of total',
    incident_total: 'Incident count',
    overview: 'Overview',
    totals: 'Totals',
    /* eslint-enable camelcase */
  };

  static labels = {};

  static getLabel(key) {
    const labels = {
      ...this.baseLabels,
      ...this.labels,
    };

    return labels[key];
  }

  static field(fieldName, prefix = true) {
    return prefix ? [this.tableName, fieldName].join('.') : fieldName;
  }

  static primaryKey(prefix = true) {
    return this.field(this.primaryKeyField, prefix);
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

    this.setLinksObject();
  }

  setData(key, value) {
    this.data[key] = value;
  }

  hasData(key = '') {
    if (key.length) {
      return key in this.data;
    }

    return Object.keys(this.data).length > 0;
  }

  setLinksObject() {
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

  get adapted() {
    return this.adapt(this.data);
  }

  get exists() {
    return Boolean(this.data.id);
  }
}

module.exports = Base;
