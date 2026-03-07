const Table = require('../../lib/db/mysql/table');

class People extends Table {
  static perPage = 40;

  /* eslint-disable camelcase */
  static fieldNames = {
    id:           { select: true, },
    identical_id: { select: true, adapt: false, },
    pernr:        { select: true, },
    type:         { select: true, },
    name:         { select: true, },
    family:       { select: false, },
  };
  /* eslint-enable camelcase */
}

module.exports = People;
