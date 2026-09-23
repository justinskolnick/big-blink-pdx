const Table = require('../../lib/db/mysql/table');

class CityOfficeTerms extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:               { type: 'integer',  select: true, },
    person_id:        { type: 'integer',  select: false, },
    city_office_id:   { type: 'integer',  select: true,   adapt: false, },
    duration_number:  { type: 'integer',  select: true,   adapt: false, },
    duration_unit:    { type: 'string',   select: true,   adapt: false, },
    election_id:      { type: 'integer',  select: true,   adapt: false, },
    date_start:       { type: 'date',     select: true, },
    date_end:         { type: 'date',     select: true, },
    date_end_actual:  { type: 'date',     select: true, },
    date_end_reason:  { type: 'string',   select: false },
  };
  /* eslint-enable camelcase */
}

module.exports = CityOfficeTerms;
