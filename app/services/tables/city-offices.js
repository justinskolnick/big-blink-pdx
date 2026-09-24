const Table = require('../../lib/db/mysql/table');

class CityOffices extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:         { type: 'integer', },
    office:     { type: 'string', },
    district:   { type: 'integer', },
    position:   { type: 'integer', },
    is_elected: { type: 'boolean', },
    date_start: { type: 'date', },
    date_end:   { type: 'date', },
  };
  /* eslint-enable camelcase */

  static defaultFields = [
    'id',
    'office',
    'district',
    'position',
    'is_elected',
  ];
}

module.exports = CityOffices;
