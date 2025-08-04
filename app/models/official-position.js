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

  setName(value) {
    this.setData('name', value);
  }

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

  get hasArea() {
    return this.hasData('area');
  }

  get hasDistrict() {
    return Number.isInteger(this.getData('district'));
  }

  get hasRank() {
    return this.hasData('rank');
  }

  get isElected() {
    return isTruthy(this.getData('is_elected'));
  }

  get isSubordinate() {
    if (this.isElected) {
      return false;
    }

    return Number.isInteger(this.getData('responsible_to_pernr'));
  }

  get isWithdrawn() {
    return isTruthy(this.getData('is_withdrawn'));
  }

  get area() {
    if (this.hasArea) {
      return this.getData('area');
    }

    return null;
  }

  get district() {
    if (this.hasDistrict) {
      return this.getData('district');
    }

    return null;
  }

  get personalName() {
    return this.getData('name');
  }

  get rank() {
    if (this.hasRank) {
      return this.getData('rank');
    }

    return null;
  }

  get role() {
    return this.toPhrase([
      this.rank,
      this.getData('role'),
    ]);
  }

  get roleStatement() {
    const parts = [];
    const prefix = this.constructor.labelPrefix;

    parts.push(this.rank);
    parts.push(this.getData('role'));

    if (this.hasRank && this.hasArea) {
      parts.push(this.getLabel('for_area', prefix, { area: this.area }));
    }

    if (this.hasDistrict) {
      parts.push(this.getLabel('for_district', prefix, { district: this.district }));
    }

    return this.toPhrase(parts);
  }

  get titleAsSupervisor() {
    if (this.isSubordinate) {
      return null;
    }

    return this.toPhrase([
      this.role,
      this.personalName,
    ]);
  }
}

module.exports = OfficialPosition;
