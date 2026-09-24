const Table = require('../../lib/db/mysql/table');

class Elections extends Table {
  static types = {
    general: 'general',
    primary: 'primary',
    special: 'special',
  };

  /* eslint-disable camelcase */
  static fieldNames = {
    id:           { type: 'integer', },
    year:         { type: 'integer', },
    type:         { type: 'string',  },
    election_day: { type: 'date',     adapt: false, },
  };
  /* eslint-enable camelcase */

  static defaultFields = [
    'id',
    'year',
    'type',
    'election_day',
  ];
}

module.exports = Elections;
