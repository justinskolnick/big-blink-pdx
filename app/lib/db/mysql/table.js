const camelCase = require('lodash.camelcase');
const pluralize = require('pluralize');

const dateHelper = require('../../../helpers/date');

const { snakeCase, titleCase } = require('../../string');
const { isTruthy } = require('../../util');

class Table {
  static primaryKeyField = 'id';

  static field(fieldName, prefix = true) {
    return prefix ? [this.tableName(), fieldName].join('.') : fieldName;
  }

  static primaryKey(prefix = true) {
    return this.field(this.primaryKeyField, prefix);
  }

  static className() {
    return this.name.replace(/^_/, '');
  }

  static tableName() {
    return snakeCase(this.className());
  }

  static singular() {
    return pluralize(titleCase(this.className()), 1).toLowerCase();
  }

  static plural() {
    return pluralize(titleCase(this.className())).toLowerCase();
  }

  static foreignKey() {
    const name = this.foreignKeyBase || pluralize(this.className(), 1);
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
}

module.exports = Table;
