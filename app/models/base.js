const dateHelper = require('../helpers/date');

class Base {
  static fields() {
    const fields = Object.entries(this.fieldNames)
      .filter(([, value]) => Boolean(value))
      .map(([key,]) => [this.tableName, key].join('.'));

    return fields;
  }

  static readableDate(str) {
    return dateHelper.formatDateString(str);
  }
}

module.exports = Base;
