const AssociatedPerson = require('../associated/person');
const Source = require('./source');

class SourceAttendee extends AssociatedPerson {
  static associatingClass = Source;

  static getValueLabelKey(role, association) {
    return association;
  }
}

module.exports = SourceAttendee;
