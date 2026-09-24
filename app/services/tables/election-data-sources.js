const Table = require('../../lib/db/mysql/table');

class ElectionDataSources extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:             { type: 'integer', },
    election_id:    { type: 'integer', },
    data_source_id: { type: 'integer', },
  };
  /* eslint-enable camelcase */

  static defaultFields = [
    'id',
    'election_id',
    'data_source_id',
  ];
}

module.exports = ElectionDataSources;
