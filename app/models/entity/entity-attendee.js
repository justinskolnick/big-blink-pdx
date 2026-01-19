const AssociatedPerson = require('../associated/person');
const Entity = require('./entity');

class EntityAttendee extends AssociatedPerson {
  static childClass = Entity;
  static associatedWith = 'entity';

  static getValueLabelKey(role, association) {
    return `as_entity_${association}`;
  }
}

module.exports = EntityAttendee;
