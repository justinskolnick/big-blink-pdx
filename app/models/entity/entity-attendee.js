const Attendee = require('../attendee');
const Entity = require('./entity');

class EntityAttendee extends Attendee {
  static labelPrefix = Entity.labelPrefix;
  static roleType = 'entity';

  static getValueLabelKey(role, association) {
    return `as_entity_${association}`;
  }
}

module.exports = EntityAttendee;
