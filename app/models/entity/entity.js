const { ROLE_LOBBYIST } = require('../../config/constants');

const IncidentedBase = require('../shared/base-incidented');
const Role = require('../role');

class Entity extends IncidentedBase {
  static tableName = 'entities';
  static labelPrefix = 'entity';
  static linkKey = 'entity';

  static perPage = 40;

  static fieldNames = {
    id:     { select: true, },
    name:   { select: true, },
    domain: { select: true, },
  };

  adaptRoles(value) {
    let list = [];
    let options = {};

    if (value) {
      list = Role.getList(value);
      options = Role.getOptions(value);
    }

    return {
      label: this.getLabel('associations_roles'),
      list,
      options,
    };
  }

  adapt(result) {
    return this.adaptResult(result, {
      roles: this.adaptRoles(ROLE_LOBBYIST),
      type: 'entity',
    });
  }
}

module.exports = Entity;
