const {
  COLLECTION_ATTENDEES,
  ROLE_ENTITY,
} = require('../../config/constants');

const Role = require('../role');

class EntityRole extends Role {
  static allOptions = [
    ROLE_ENTITY,
  ];

  filterRole = false;

  labelPrefix = 'entity';

  configCollections() {
    return [
      COLLECTION_ATTENDEES,
    ];
  }
}

module.exports = EntityRole;
