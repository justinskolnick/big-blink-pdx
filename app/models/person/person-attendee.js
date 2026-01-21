const AssociatedPerson = require('../associated/person');
const Person = require('./person');

class PersonAttendee extends AssociatedPerson {
  static associatingClass = Person;
}

module.exports = PersonAttendee;
