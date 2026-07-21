const Table = require('../../lib/db/mysql/table');

class Elections extends Table {
  static types = {
    general: 'general',
    primary: 'primary',
    special: 'special',
  };

  /* eslint-disable camelcase */
  static fieldNames = {
    id:           { select: true, },
    year:         { select: true, },
    type:         { select: true, },
    election_day: { select: true, adapt: false, },
  };
  /* eslint-enable camelcase */
}

module.exports = Elections;
