const Base = require('./shared/base');

const QuartersTable = require('../services/tables/quarters');

class Quarter extends Base {
  static table = QuartersTable;

  get readablePeriod() {
    return `${this.getData('year')} Q${this.getData('quarter')}`;
  }

  get slug() {
    return this.getData('slug');
  }

  get year() {
    return this.getData('year');
  }
}

module.exports = Quarter;
