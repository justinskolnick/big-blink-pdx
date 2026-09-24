const Table = require('../../lib/db/mysql/table');

class CityOfficeTerms extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:               { type: 'integer', },
    person_id:        { type: 'integer', },
    city_office_id:   { type: 'integer',  adapt: false, },
    duration_number:  { type: 'integer',  adapt: false, },
    duration_unit:    { type: 'string',   adapt: false, },
    election_id:      { type: 'integer',  adapt: false, },
    date_start:       { type: 'date', },
    date_end:         { type: 'date', },
    date_end_actual:  { type: 'date', },
    date_end_reason:  { type: 'string', },
  };
  /* eslint-enable camelcase */

  static defaultFields = [
    'id',
    'city_office_id',
    'duration_number',
    'duration_unit',
    'election_id',
    'date_start',
    'date_end',
    'date_end_actual',
  ];
}

module.exports = CityOfficeTerms;
