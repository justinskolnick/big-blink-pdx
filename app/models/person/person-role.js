const {
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../config/constants');

const Role = require('../role');

class PersonRole extends Role {
  static allOptions = [
    ROLE_OFFICIAL,
    ROLE_LOBBYIST,
  ];

  hasAttendees = true;
  hasEntities = true;
  filterRole = true;

  labelPrefix = 'person';
}

module.exports = PersonRole;
