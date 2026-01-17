const AssociatedPerson = require('../associated/person');
const Person = require('./person');

class PersonAttendee extends AssociatedPerson {
  static labelPrefix = Person.labelPrefix;
  static associatedWith = 'person';
}

module.exports = PersonAttendee;
