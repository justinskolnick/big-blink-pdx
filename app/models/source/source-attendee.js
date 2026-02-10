const AssociatedPerson = require('../associated/person');
const Source = require('./source');

class SourceAttendee extends AssociatedPerson {
  static associatingClass = Source;
}

module.exports = SourceAttendee;
