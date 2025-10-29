const {
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../config/constants');

const ROLE_OPTIONS = [
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
];

class Role {
  role = null;

  static isValidOption(value) {
    return ROLE_OPTIONS.includes(value);
  }

  static getList(values) {
    return values?.split(',').filter(value => this.isValidOption(value)) ?? [];
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
