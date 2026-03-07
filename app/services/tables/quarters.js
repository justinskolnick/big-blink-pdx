const Table = require('../../lib/db/mysql/table');

class Quarters extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:         { select: true, },
    year:       { select: true, },
    quarter:    { select: true, },
    slug:       { select: true, },
    date_start: { select: true, adapt: { method: this.readableDate }, },
    date_end:   { select: true, adapt: { method: this.readableDate }, },
  };
  /* eslint-enable camelcase */
}

module.exports = Quarters;
