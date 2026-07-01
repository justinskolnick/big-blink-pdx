const Base = require('./shared/base');

const { toNumeral } = require('../lib/number');

const CityOfficeTermsTable = require('../services/tables/city-office-terms');

class CityOfficeTerm extends Base {
  static table = CityOfficeTermsTable;

  cityOffice = null;

  setCityOffice(cityOffice) {
    this.cityOffice = cityOffice;
  }

  adapt(result) {
    return this.adaptResult(result, {
      office: this.cityOffice.adapted,
      raw: {
        dateStart: result.date_start,
        dateEnd: result.date_end,
      },
    });
  }

  get duration() {
    const numeral = toNumeral(this.getData('duration_number'));
    const unit = this.getData('duration_unit');

    return this.getLabel('number-unit', null, {
      number: this.getLabel(numeral, 'numeral'),
      unit: this.getLabel(unit, 'unit'),
    });
  }

  get readableDateStart() {
    return this.constructor.readableDate(this.getData('date_start'));
  }

  get readableDateEnd() {
    return this.constructor.readableDate(this.getData('date_end'));
  }

  get isCurrent() {
    const dateStart = new Date(this.getData('date_start'));
    const dateEnd = new Date(this.getData('date_end'));
    const now = new Date();

    return dateStart < now && dateEnd > now;
  }
}

module.exports = CityOfficeTerm;
