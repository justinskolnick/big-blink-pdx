const {
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../config/constants');

const IncidentedBase = require('../shared/base-incidented');
const Role = require('./person-role');

class Person extends IncidentedBase {
  static tableName = 'people';
  static labelPrefix = 'person';
  static linkKey = 'person';

  static perPage = 40;

  static fieldNames = {
    id:           { select: true, },
    identical_id: { select: true, adapt: false, }, // eslint-disable-line camelcase
    pernr:        { select: true, },
    type:         { select: true, },
    name:         { select: true, },
    family:       { select: false, },
  };

  static roleOptions = [
    ROLE_OFFICIAL,
    ROLE_LOBBYIST,
  ];

  adaptRoles(value) {
    const roleOptions = this.constructor.roleOptions;

    let list = [];
    let options = {};

    if (value) {
      list = Role.getRoleList(roleOptions, value);
      options = Role.getRoleOptions(roleOptions, value);
    }

    return {
      label: this.getLabel('associations_roles'),
      list,
      options,
    };
  }

  adapt(result) {
    return this.adaptResult(result, {
      roles: this.adaptRoles(result.roles),
    });
  }

  get hasMoved() {
    return this.hasData('identical_id');
  }

  get identicalId() {
    return this.getData('identical_id');
  }

  get hasPernr() {
    return this.hasData('pernr');
  }

  get pernr() {
    return this.getData('pernr');
  }

  get id() {
    return this.getData('id');
  }
}

module.exports = Person;
