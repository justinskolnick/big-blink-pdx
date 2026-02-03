const AssociatedPerson = require('../associated/person');
const Source = require('./source');

class SourceAttendee extends AssociatedPerson {
  static associatingClass = Source;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getValueLabelKey(role, association) {
    return association;
  }
}

module.exports = SourceAttendee;
