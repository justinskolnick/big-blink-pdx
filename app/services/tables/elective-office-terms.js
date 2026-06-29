const Table = require('../../lib/db/mysql/table');

class ElectiveOfficeTerms extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:                 { select: true, },
    person_id:          { select: false, },
    elective_office_id: { select: false, },
    duration_years:     { select: true, },
    date_start:         { select: true, adapt: { method: 'readableDate' }, },
    date_end:           { select: true, adapt: { method: 'readableDate' }, },
  };
  /* eslint-enable camelcase */
}

module.exports = ElectiveOfficeTerms;
