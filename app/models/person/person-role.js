const {
  COLLECTION_ATTENDEES,
  COLLECTION_ENTITIES,
} = require('../../config/constants');

const Role = require('../role');

class PersonRole extends Role {
  filterRole = true;

  labelPrefix = 'person';

  configCollections() {
    return [
      COLLECTION_ATTENDEES,
      COLLECTION_ENTITIES,
    ];
  }

  setAttendees(attendees) {
    this.setCollection(COLLECTION_ATTENDEES, attendees);
  }

  setEntities(entities) {
    this.setCollection(COLLECTION_ENTITIES, entities);
  }
}

module.exports = PersonRole;
