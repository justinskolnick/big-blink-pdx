const {
  COLLECTION_ATTENDEES,
  COLLECTION_ENTITIES,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../config/constants');

const IncidentedBase = require('../shared/base-incidented');

const PeopleTable = require('../../services/tables/people');

class Person extends IncidentedBase {
  static table = PeopleTable;

  static labelPrefix = 'person';
  static linkKey = 'person';

  static perPage = 40;

  static roleOptions = [
    ROLE_OFFICIAL,
    ROLE_LOBBYIST,
  ];

  static roleCollections = [
    COLLECTION_ATTENDEES,
    COLLECTION_ENTITIES,
  ];

  static includeRoleInFilters = true;

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
