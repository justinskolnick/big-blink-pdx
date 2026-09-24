const Table = require('../../lib/db/mysql/table');

const People = require('./people');

class IncidentAttendees extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:           { type: 'integer', },
    incident_id:  { type: 'integer', },
    person_id:    { type: 'integer', },
    appears_as:   { type: 'string',   adapt: false, },
    role:         { type: 'string', },
  };
  /* eslint-enable camelcase */

  static defaultFields = [
    'id',
    'appears_as',
    'role',
  ];

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
