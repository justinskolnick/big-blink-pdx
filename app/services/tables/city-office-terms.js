const Table = require('../../lib/db/mysql/table');

class CityOfficeTerms extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:               { select: true, },
    person_id:        { select: false, },
    city_office_id:   { select: true, },
    duration_years:   { select: true, },
    date_start:       { select: true, adapt: { method: 'readableDate' }, },
    date_end:         { select: true, adapt: { method: 'readableDate' }, },
  };
  /* eslint-enable camelcase */
}

module.exports = CityOfficeTerms;
