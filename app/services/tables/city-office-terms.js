const Table = require('../../lib/db/mysql/table');

class CityOfficeTerms extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:               { select: true, },
    person_id:        { select: false, },
    city_office_id:   { select: true, adapt: false, },
    duration_number:  { select: true, adapt: false, },
    duration_unit:    { select: true, adapt: false, },
    election_id:      { select: true, adapt: false, },
    date_start:       { select: true, adapt: { method: 'readableDate' }, },
    date_end:         { select: true, adapt: { method: 'readableDate' }, },
    date_end_actual:  { select: true, adapt: { method: 'readableDate' }, },
    date_end_reason:  { select: false },
  };
  /* eslint-enable camelcase */
}

module.exports = CityOfficeTerms;
