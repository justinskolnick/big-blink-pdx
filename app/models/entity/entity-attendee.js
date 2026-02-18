const AssociatedPerson = require('../associated/person');
const Entity = require('./entity');

class EntityAttendee extends AssociatedPerson {
  static associatingClass = Entity;
}

module.exports = EntityAttendee;
