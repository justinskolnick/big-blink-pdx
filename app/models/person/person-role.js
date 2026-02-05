const {
  ASSOCIATION_COLLECTION_ATTENDEES,
  ASSOCIATION_COLLECTION_ENTITIES,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../config/constants');

const Role = require('../role');

class PersonRole extends Role {
  static allOptions = [
    ROLE_OFFICIAL,
    ROLE_LOBBYIST,
  ];

  collections = [
    ASSOCIATION_COLLECTION_ATTENDEES,
    ASSOCIATION_COLLECTION_ENTITIES,
  ];

  filterRole = true;

  labelPrefix = 'person';
}

module.exports = PersonRole;
