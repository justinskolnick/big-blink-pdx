const {
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../config/constants');

const ROLE_OPTIONS = [
  ROLE_OFFICIAL,
  ROLE_LOBBYIST,
];

class Role {
  role = null;

  static isValidOption(value) {
    return ROLE_OPTIONS.includes(value);
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
    return ROLE_OPTIONS;
  }

  constructor(role = null) {
    if (this.constructor.isValidOption(role)) {
      this.role = role;
    }
  }

  get role() {
    return this.role;
  }
}

module.exports = Role;
