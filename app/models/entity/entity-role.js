const { COLLECTION_ATTENDEES } = require('../../config/constants');

const Role = require('../role');

class EntityRole extends Role {
  filterRole = false;

  labelPrefix = 'entity';

  configCollections() {
    return [
      COLLECTION_ATTENDEES,
    ];
  }

  setAttendees(attendees) {
    this.setCollection(COLLECTION_ATTENDEES, attendees);
  }
}

module.exports = EntityRole;
