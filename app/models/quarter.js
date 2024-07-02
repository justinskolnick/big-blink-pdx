const Base = require('./base');

class Quarter extends Base {
  static tableName = 'quarters';

  static fieldNames = {
    id:         { select: true, },
    year:       { select: true, },
    quarter:    { select: true, },
    slug:       { select: true, },
    date_start: { select: false, }, // eslint-disable-line camelcase
    date_end:   { select: false, }, // eslint-disable-line camelcase
  };
}

module.exports = Quarter;
