const camelCase = require('lodash.camelcase');
const dateHelper = require('../helpers/date');

class Base {
  static fields(prefix = true) {
    const fields = Object.entries(this.fieldNames)
      .filter(([, value]) => value.select)
      .map(([key,]) => prefix ? [this.tableName, key].join('.') : key);

    return fields;
  }

  static hasFieldAlias(fieldName) {
    if ('adapt' in this.fieldNames[fieldName]) {
      if ('as' in this.fieldNames[fieldName].adapt) {
        return true;
      }
    }

    return false;
  }

  static fieldAlias(fieldName) {
    return this.fieldNames[fieldName].adapt.as;
  }

  static hasAdaptMethod(fieldName) {
    if ('adapt' in this.fieldNames[fieldName]) {
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
      value = this.fieldMethod(fieldName)(value);
    }

    return value;
  }

  static readableDate(str) {
    return dateHelper.formatDateString(str);
  }

  static adaptResult(result, others) {
    const fields = this.fields(false);
    const adapted = fields.reduce((obj, field) => {
      const key = this.fieldKey(field);
      const value = this.fieldValue(field, result);

      obj[key] = value;

      return obj;
    }, {});

    return {
      ...adapted,
      ...this.adaptTotal(result),
      ...others,
    };
  }

  static adaptTotal(result) {
    if (result.total) {
      return {
        incidents: {
          stats: {
            total: result.total,
          },
        },
      };
    }

    return undefined;
  }

  static adapt(result) {
    return this.adaptResult(result);
  }
}

module.exports = Base;
