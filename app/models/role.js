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

  hasAttendees = false;
  hasEntities = false;
  filterRole = false;

  constructor(role = null) {
    this.labels = new Labels();

    if (this.constructor.isValidOption(role)) {
      this.role = role;
    }
  }

  getLabel(key, prefix) {
    return this.labels.getLabel(key, prefix);
  }

  get hasRole() {
    return this.role !== null;
  }

  get role() {
    return this.role;
  }

  toObject() {
    if (!this.hasRole) {
      return null;
    }

    const obj = {
      filterRole: this.filterRole,
      label: this.getLabel(`as_${this.role}`, this.labelPrefix),
      role: this.role,
    };

    if (this.hasAttendees) {
      obj.attendees = null;
    }

    if (this.hasEntities) {
      obj.entities = null;
    }

    return obj;
  }
}

module.exports = Role;
