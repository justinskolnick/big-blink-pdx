const {
  TIME_MONTH,
  TIME_YEAR,
} = require('../config/constants');

const {
  getDaysApart,
  getMonthsToYears,
  getYearsToMonths,
} = require('../lib/date');
const { toNumeral } = require('../lib/number');
const { sortDateStartDescending } = require('../lib/sorting');

const Base = require('./shared/base');

const CityOfficeTermsTable = require('../services/tables/city-office-terms');

class CityOfficeTerm extends Base {
  static table = CityOfficeTermsTable;

  static collect(results) {
    return results.sort(sortDateStartDescending).reduce((collected, current, i) => {
      if (i > 0) {
        const previous = collected.at(-1);

        if (current.isConsecutiveWithTerm(previous) && current.isSameOfficeAsTerm(previous)) {
          previous.addTerm(current);
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
  election = null;

  configureOtherValues() {
    super.terms = [];

    this.setTerm();
  }

  setCityOffice(cityOffice) {
    this.cityOffice = cityOffice;
  }

  setElection(election) {
    this.election = election;
  }

  setTerm() {
    let number = this.getData('duration_number');

    if (this.getData('duration_unit') === TIME_YEAR) {
      number = getYearsToMonths(this.getData('duration_number'));
    }

    this.terms.push({
      dates: {
        start: this.getData('date_start'),
        end: this.getData('date_end'),
      },
      number,
      unit: TIME_MONTH,
    });
  }

  addTerm(term) {
    this.terms = [].concat(this.terms, term.terms);
  }

  adapt(result) {
    const otherValues = {
      dateEnd: this.readableDateEnd,
      dateStart: this.readableDateStart,
      tenure: this.tenure,
      id: this.id,
      raw: {
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
      },
    };

    if (this.hasCityOffice()) {
      otherValues.office = this.cityOffice.adapted;
    }

    if (this.hasElection()) {
      otherValues.election = this.election.adapted;
    }

    return this.adaptResult(result, otherValues);
  }

  hasCityOffice() {
    return this.cityOffice !== null;
  }

  hasElection() {
    return this.election !== null;
  }

  isConsecutiveWithTerm(term) {
    const daysApart = getDaysApart(this.dateEnd, term.dateStart);

    return daysApart === 1;
  }

  isCurrent() {
    const dateStart = new Date(this.dateStart);
    const dateEnd = new Date(this.dateEnd);
    const now = new Date();

    return dateStart < now && dateEnd > now;
  }

  isSameOfficeAsTerm(term) {
    return this.cityOffice?.id === term.cityOffice?.id;
  }

  wasReelected() {
    return this.terms.length > 1;
  }

  get dateStart() {
    return this.terms.map(term => term.dates.start).sort().at(0);
  }

  get dateEnd() {
    return this.terms.map(term => term.dates.end).sort().at(-1);
  }

  get id() {
    return this.getData('id');
  }

  get readableDateStart() {
    return this.constructor.readableDate(this.dateStart);
  }

  get readableDateEnd() {
    return this.constructor.readableDate(this.dateEnd);
  }

  get readableTenure() {
    const number = getMonthsToYears(this.tenure.number);
    const unit = TIME_YEAR;

    return this.getLabel('number-unit', null, {
      number: this.getLabel(toNumeral(number), 'numeral'),
      unit: this.getLabel(unit, 'unit'),
    });
  }

  get tenure() {
    return this.terms.reduce((collected, current) => {
      const number = collected.number || 0;
      const unit = collected.unit || TIME_MONTH;

      return {
        number: number + current.number,
        unit,
      };
    }, {});
  }

  get termCount() {
    return this.terms.length;
  }
}

module.exports = CityOfficeTerm;
