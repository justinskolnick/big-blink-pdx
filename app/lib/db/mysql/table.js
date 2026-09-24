const camelCase = require('lodash.camelcase');
const pluralize = require('pluralize');

const { snakeCase, titleCase } = require('../../string');

class Table {
  static primaryKeyField = 'id';

  static fieldNames = {};

  static defaultFields = [];

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
    return pluralize(titleCase(this.className()), 2).toLowerCase();
  }

  static foreignKey() {
    const name = this.foreignKeyBase || pluralize(this.className(), 1);
    const primaryKey = this.primaryKeyField;
    const key = [name, primaryKey].join(' ');

    return snakeCase(key);
  }

  static fields(prefix = true) {
    return this.defaultFields.map((fieldName) => this.field(fieldName, prefix));
  }

  static fieldsForJoin(prefix = true) {
    return this.defaultFields
      .filter((fieldName) => fieldName !== 'id')
      .map((fieldName) => this.field(fieldName, prefix));
  }

  static fieldType(fieldName) {
    return this.fieldNames[fieldName].type;
  }

  static fieldTypeIsBoolean(fieldName) {
    return this.fieldType(fieldName) === 'boolean';
  }

  static fieldTypeIsDate(fieldName) {
    return this.fieldType(fieldName) === 'date';
  }

  static fieldTypeIsTimestamp(fieldName) {
    return this.fieldType(fieldName) === 'timestamp';
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

  static fieldKey(fieldName) {
    if (this.hasFieldAlias(fieldName)) {
      const alias = this.fieldAlias(fieldName);

      return camelCase(alias);
    }

    return camelCase(fieldName);
  }
}

module.exports = Table;
