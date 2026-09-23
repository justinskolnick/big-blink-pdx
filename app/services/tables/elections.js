const Table = require('../../lib/db/mysql/table');

class Elections extends Table {
  static types = {
    general: 'general',
    primary: 'primary',
    special: 'special',
  };

  /* eslint-disable camelcase */
  static fieldNames = {
    id:           { type: 'integer',  select: true, },
    year:         { type: 'integer',  select: true, },
    type:         { type: 'string',   select: true, },
    election_day: { type: 'date',     select: true,   adapt: false, },
  };
  /* eslint-enable camelcase */
}

module.exports = Elections;
