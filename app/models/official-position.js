const { isTruthy } = require('../lib/util');

const Base = require('./shared/base');

class OfficialPosition extends Base {
  static tableName = 'official_positions';

  static labelPrefix = 'official_positions';

  /* eslint-disable camelcase */
  static fieldNames = {
    id:                   { select: false, },
    pernr:                { select: true, },
    name:                 { select: true, },
    date_start:           { select: true, },
    date_end:             { select: true, },
    is_withdrawn:         { select: true, adapt: false, },
    is_elected:           { select: true, adapt: false, },
    office:               { select: true, },
    position:             { select: true, },
    district:             { select: true, },
    responsible_to_pernr: { select: true, adapt: false, },
    area:                 { select: true, },
    assignment:           { select: true, },
    classification:       { select: true, },
    rank:                 { select: true, },
    is_chief:             { select: true, adapt: { method: this.readableBoolean }, },
    role:                 { select: true, },
  };
  /* eslint-enable camelcase */

  adaptReadableConditionalDate(result, fieldName) {
    const value = this.getData(fieldName);
    const hasValue = value !== null;
    const isEndDate = fieldName === 'date_end';

    if (hasValue) {
      return this.constructor.readableDate(value);
    } else if (this.isWithdrawn && isEndDate) {
      return this.getLabel('unknown', this.constructor.labelPrefix);
    }

    return null;
  }

  adapt(result) {
    return this.adaptResult(result, {
      dates: {
        dateFrom: this.adaptReadableConditionalDate(result, 'date_start'),
        dateTo: this.adaptReadableConditionalDate(result, 'date_end'),
      },
    });
  }

  get isElected() {
    return isTruthy(this.getData('is_elected'));
  }

  get isWithdrawn() {
    return isTruthy(this.getData('is_withdrawn'));
  }

  get isSubordinate() {
    if (this.isElected) {
      return false;
    }

    return Number.isInteger(this.getData('responsible_to_pernr'));
  }
}

module.exports = OfficialPosition;
