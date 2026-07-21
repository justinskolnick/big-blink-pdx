const { isTruthy } = require('../lib/util');

const Base = require('./shared/base');

const ElectionsTable = require('../services/tables/elections');

class Election extends Base {
  static table = ElectionsTable;

  adapt(result) {
    const timestamp = this.getData('election_day');

    return this.adaptResult(result, {
      date: {
        label: this.constructor.readableDate(timestamp),
        value: timestamp,
      },
    });
  }
}

module.exports = Election;
