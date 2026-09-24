const Table = require('../../lib/db/mysql/table');

class ElectionDataSources extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:             { type: 'integer',  select: true, },
    election_id:    { type: 'integer',  select: true, },
    data_source_id: { type: 'integer',  select: true, },
  };
  /* eslint-enable camelcase */
}

module.exports = ElectionDataSources;
