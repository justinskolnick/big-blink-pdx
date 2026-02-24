const {
  COLLECTION_ATTENDEES,
  ROLE_ENTITY,
} = require('../../config/constants');

const IncidentedBase = require('../shared/base-incidented');

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

  static roleOptions = [
    ROLE_ENTITY,
  ];

  static roleCollections = [
    COLLECTION_ATTENDEES,
  ];

  static adaptEntityLobbyist(result) {
    return {
      id: result.id,
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
    };
  }

  adapt(result) {
    const otherValues = {
      roles: this.adaptRoles(ROLE_ENTITY),
      type: this.constructor.singular(),
    };

    if ('isRegistered' in result) {
      otherValues.registrations = this.adaptRegistrations(result);
    }

    return this.adaptResult(result, otherValues);
  }
}

module.exports = Entity;
