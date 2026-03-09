const { isEmpty, isTruthy } = require('../lib/util');

const Base = require('./shared/base');

const OfficialPositionsTable = require('../services/tables/official-positions');

class OfficialPosition extends Base {
  static table = OfficialPositionsTable;

  static labelPrefix = 'official_positions';

  static collect(results) {
    return results.reduce((collected, item, i) => {
      if (i > 0) {
        const prev = collected.at(-1);
        const fields = this.fields(false);

        fields.splice(fields.indexOf('date_start'), 1);
        fields.splice(fields.indexOf('date_end'), 1);

        if (prev.dateStart === item.dateStart && prev.dateEnd === item.dateEnd) {
          if (!fields.every(field => item.getData(field) === prev.getData(field))) {
            collected.push(item);
          }
        } else if (item.dateStart) {
          collected.push(item);
        }
      } else {
        collected.push(item);
      }

      return collected;
    }, []);
  }

  supervisor = null;

  setName(value) {
    this.setData('name', value);
  }

  setSupervisor(value) {
    this.supervisor = value;
  }

  adaptReadableConditionalDate(result, fieldName) {
    const value = this.getData(fieldName);
    const hasValue = value !== null;
    const isEndDate = fieldName === 'date_end';

    if (hasValue) {
      return this.constructor.readableDate(value);
    } else if (isEndDate && this.isWithdrawn) {
      return this.getLabel('unknown', this.constructor.labelPrefix);
    }

    return null;
  }

  adapt(result) {
    return this.adaptResult(result, {
      dates: {
        start: this.getData('date_start'),
        end: this.getData('date_end'),
      },
      role: this.roleStatement,
    });
  }

  get asSupervisor() {
    return {
      district: this.district,
      title: this.titleAsSupervisor,
    };
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

  get hasSupervisor() {
    return !isEmpty(this.supervisor);
  }

  get isAssumedCurrent() {
    return this.dateEnd === null && !this.isWithdrawn;
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

  get dateStart() {
    return this.getData('date_start');
  }

  get dateEnd() {
    return this.getData('date_end');
  }

  get district() {
    if (this.hasDistrict) {
      return this.getData('district');
    }

    return null;
  }

  get personalName() {
    if (this.hasData('personal_name')) {
      return this.getData('personal_name');
    }

    return this.getData('name');
  }

  get rank() {
    if (this.hasRank) {
      return this.getData('rank');
    }

    return null;
  }

  get responsibleToPernr() {
    if (this.isSubordinate) {
      return this.getData('responsible_to_pernr');
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

    if (this.hasSupervisor) {
      if (this.hasDistrict) {
        parts.push(this.getLabel('for_district_supervisor', prefix, {
          district: this.supervisor.district,
          supervisor: this.supervisor.title
        }));
      } else {
        parts.push(this.getLabel('for_supervisor', prefix, { supervisor: this.supervisor.title }));
      }
    } else if (this.hasDistrict) {
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
