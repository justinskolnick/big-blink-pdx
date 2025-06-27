const Base = require('./base');

class Quarter extends Base {
  static tableName = 'quarters';

  static fieldNames = {
    id:         { select: true, },
    year:       { select: true, },
    quarter:    { select: true, },
    slug:       { select: true, },
    date_start: { select: true, adapt: { method: this.readableDate }, }, // eslint-disable-line camelcase
    date_end:   { select: true, adapt: { method: this.readableDate }, }, // eslint-disable-line camelcase
  };

  get readablePeriod() {
    return `${this.getData('year')} Q${this.getData('quarter')}`;
  }
}

module.exports = Quarter;
