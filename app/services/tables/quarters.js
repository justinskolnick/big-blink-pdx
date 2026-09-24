const Table = require('../../lib/db/mysql/table');

class Quarters extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:         { type: 'integer', },
    year:       { type: 'integer', },
    quarter:    { type: 'integer', },
    slug:       { type: 'string', },
    date_start: { type: 'date', },
    date_end:   { type: 'date', },
  };
  /* eslint-enable camelcase */

  static defaultFields = [
    'id',
    'year',
    'quarter',
    'slug',
    'date_start',
    'date_end',
  ];
}

module.exports = Quarters;
