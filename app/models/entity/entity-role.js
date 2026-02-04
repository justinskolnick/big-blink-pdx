const { ROLE_ENTITY } = require('../../config/constants');

const Role = require('../role');

class EntityRole extends Role {
  static allOptions = [
    ROLE_ENTITY,
  ];

  hasAttendees = true;
  hasEntities = false;
  filterRole = false;

  labelPrefix = 'entity';
}

module.exports = EntityRole;
