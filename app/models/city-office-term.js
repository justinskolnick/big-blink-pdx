const Base = require('./shared/base');

const { getDaysApart } = require('../lib/date');
const { toNumeral } = require('../lib/number');

const CityOfficeTermsTable = require('../services/tables/city-office-terms');

class CityOfficeTerm extends Base {
  static table = CityOfficeTermsTable;

  static termsAreConsecutive(current, previous) {
    const daysApart = getDaysApart(current.dateEnd, previous.dateStart);

    return daysApart === 1;
  }

  static officesAreIdentical(current, previous) {
    return current.cityOffice.office === previous.cityOffice.office;
  }

  static collect(results) {
    return results.reduce((collected, current, i) => {
      if (i > 0) {
        const previous = collected.at(-1);

        if (this.termsAreConsecutive(current, previous) && this.officesAreIdentical(current, previous)) {
          previous.setCumulativeDates(current.dateStart, previous.dateEnd);
          previous.setCumulativeDuration(previous.duration.number + current.duration.number, previous.duration.unit);
        } else {
          collected.push(current);
        }
      } else {
        collected.push(current);
      }

      return collected;
    }, []);
  }

  cityOffice = null;
  cumulative = {
    dates: null,
    duration: null,
  };

  setCityOffice(cityOffice) {
    this.cityOffice = cityOffice;
  }

  setCumulativeDates(start, end) {
    this.cumulative.dates = {
      start,
      end,
    };
  }

  setCumulativeDuration(number, unit) {
    this.cumulative.duration = {
      number,
      unit,
    };
  }

  adapt(result) {
    return this.adaptResult(result, {
      dateStart: this.readableDateStart,
      dateEnd: this.readableDateEnd,
      durationNumber: this.duration.number,
      durationUnit: this.duration.unit,
      office: this.cityOffice.adapted,
      raw: {
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
      },
    });
  }

  isCurrent() {
    const dateStart = new Date(this.dateStart);
    const dateEnd = new Date(this.dateEnd);
    const now = new Date();

    return dateStart < now && dateEnd > now;
  }

  wasReelected() {
    return this.cumulative.dates !== null;
  }

  get dateStart() {
    return this.cumulative.dates?.start ?? this.getData('date_start');
  }

  get dateEnd() {
    return this.cumulative.dates?.end ?? this.getData('date_end');
  }

  get duration() {
    const number = this.cumulative.duration?.number ?? this.getData('duration_number');
    const unit = this.cumulative.duration?.unit ?? this.getData('duration_unit');

    return {
      number,
      unit,
    };
  }

  get readableDateStart() {
    return this.constructor.readableDate(this.dateStart);
  }

  get readableDateEnd() {
    return this.constructor.readableDate(this.dateEnd);
  }

  get readableDuration() {
    const number = this.duration.number;
    const unit = this.duration.unit;

    return this.getLabel('number-unit', null, {
      number: this.getLabel(toNumeral(number), 'numeral'),
      unit: this.getLabel(unit, 'unit'),
    });
  }
}

module.exports = CityOfficeTerm;
