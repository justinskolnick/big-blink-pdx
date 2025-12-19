const Attendee = require('../attendee');
const Person = require('./person');

class PersonAttendee extends Attendee {
  static labelPrefix = Person.labelPrefix;
  static roleType = 'person';
}

module.exports = PersonAttendee;
