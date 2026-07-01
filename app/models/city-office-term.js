const Base = require('./shared/base');

const CityOfficeTermsTable = require('../services/tables/city-office-terms');

class CityOfficeTerm extends Base {
  static table = CityOfficeTermsTable;

  cityOffice = null;

  setCityOffice(cityOffice) {
    this.cityOffice = cityOffice;
  }

  adapt(result) {
    // console.log('result',result);
    // console.log('data', this.data);
    // console.log('cityOffice', this.cityOffice.adapted);
    return this.adaptResult(result, {
      office: this.cityOffice.adapted,
      raw: {
        dateStart: result.date_start,
        dateEnd: result.date_end,
      },
    });
  }
}

module.exports = CityOfficeTerm;
