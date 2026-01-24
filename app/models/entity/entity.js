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

  static adaptEntityLobbyist(result) {
    return {
      id: result.id,
    };
  }

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

  adaptRegistrations(result) {
    const prefix = this.constructor.labelPrefix;
    const labels = this.constructor.labels;
    let key;

    if (result.isRegistered) {
      key = 'registration_found';
    } else {
      key = 'registration_not_found';
    }

    return {
      isRegistered: result.isRegistered,
      labels: {
        title: labels.getLabel(key, prefix),
      },
      registrations: labels.getLabel(key, prefix), // todo: nix
    };
  }

  adapt(result) {
    let registrations;

    if ('isRegistered' in result) {
      registrations = this.adaptRegistrations(result);
    }

    return this.adaptResult(result, {
      ...registrations, // todo: nix
      // registrations, // todo: set
      roles: this.adaptRoles(ROLE_LOBBYIST),
      type: this.constructor.singular(),
    });
  }
}

module.exports = Entity;
