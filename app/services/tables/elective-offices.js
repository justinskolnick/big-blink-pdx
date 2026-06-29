const Table = require('../../lib/db/mysql/table');

class ElectiveOffices extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:         { select: true, },
    office:     { select: true, },
    district:   { select: true, },
    position:   { select: true, },
    date_start: { select: false, },
    date_end:   { select: false, },

  };
  /* eslint-enable camelcase */
}

module.exports = ElectiveOffices;
