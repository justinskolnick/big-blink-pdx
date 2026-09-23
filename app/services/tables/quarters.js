const Table = require('../../lib/db/mysql/table');

class Quarters extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:         { type: 'integer',  select: true, },
    year:       { type: 'integer',  select: true, },
    quarter:    { type: 'integer',  select: true, },
    slug:       { type: 'string',   select: true, },
    date_start: { type: 'date',     select: true, },
    date_end:   { type: 'date',     select: true, },
  };
  /* eslint-enable camelcase */
}

module.exports = Quarters;
