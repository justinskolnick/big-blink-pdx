const Table = require('../../lib/db/mysql/table');

class CityOffices extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:         { type: 'integer',  select: true, },
    office:     { type: 'string',   select: true, },
    district:   { type: 'integer',  select: true, },
    position:   { type: 'integer',  select: true, },
    is_elected: { type: 'boolean',  select: true, },
    date_start: { type: 'date',     select: false, },
    date_end:   { type: 'date',     select: false, },
  };
  /* eslint-enable camelcase */
}

module.exports = CityOffices;
