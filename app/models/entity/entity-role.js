const {
  ASSOCIATION_COLLECTION_ATTENDEES,
  ROLE_ENTITY,
} = require('../../config/constants');

const Role = require('../role');

class EntityRole extends Role {
  static allOptions = [
    ROLE_ENTITY,
  ];

  collections = [
    ASSOCIATION_COLLECTION_ATTENDEES,
  ];

  filterRole = false;

  labelPrefix = 'entity';
}

module.exports = EntityRole;
