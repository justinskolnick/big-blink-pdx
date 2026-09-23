const Table = require('../../lib/db/mysql/table');

const People = require('./people');

class IncidentAttendees extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:           { type: 'integer',  select: true, },
    incident_id:  { type: 'integer',  select: false, },
    person_id:    { type: 'integer',  select: false, },
    appears_as:   { type: 'string',   select: true,   adapt: false, },
    role:         { type: 'string',   select: true, },
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
