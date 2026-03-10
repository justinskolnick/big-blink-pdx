const Table = require('../../lib/db/mysql/table');

const People = require('./people');

class IncidentAttendees extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:           { select: true, },
    incident_id:  { select: false, },
    person_id:    { select: false, },
    appears_as:   { select: true, adapt: { as: 'as' } },
    role:         { select: true, },
  };
  /* eslint-enable camelcase */

  static personFields(without = []) {
    const fieldNames = [
      'id',
      'name',
      'pernr',
      'type',
    ];

    return fieldNames
      .filter(fieldName => !without.includes(fieldName))
      .map(fieldName => People.field(fieldName));
  }
}

module.exports = IncidentAttendees;
