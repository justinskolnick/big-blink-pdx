const Table = require('../../lib/db/mysql/table');

class ElectionDataSources extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:             { select: true, },
    election_id:    { select: true, },
    data_source_id: { select: true, },
  };
  /* eslint-enable camelcase */
}

module.exports = ElectionDataSources;
