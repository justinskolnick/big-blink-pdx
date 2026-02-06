const {
  COLLECTION_ATTENDEES,
  COLLECTION_ENTITIES,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../config/constants');

const Role = require('../role');

class PersonRole extends Role {
  static allOptions = [
    ROLE_OFFICIAL,
    ROLE_LOBBYIST,
  ];

  filterRole = true;

  labelPrefix = 'person';

  configCollections() {
    return [
      COLLECTION_ATTENDEES,
      COLLECTION_ENTITIES,
    ];
  }
}

module.exports = PersonRole;
