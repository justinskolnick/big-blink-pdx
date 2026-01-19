const AssociatedPerson = require('../associated/person');
const Person = require('./person');

class PersonAttendee extends AssociatedPerson {
  static childClass = Person;
}

module.exports = PersonAttendee;
