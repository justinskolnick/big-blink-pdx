const Base = require('./shared/base');

const ElectiveOfficeTermsTable = require('../services/tables/elective-office-terms');

class ElectiveOfficeTerm extends Base {
  static table = ElectiveOfficeTermsTable;

  adapt(result) {
    // console.log('result',result);
    // console.log('data', this.data);
    return this.adaptResult(result, {
      office: result.office,
      district: result.district,
      raw: {
        dateStart: result.date_start,
        dateEnd: result.date_end,
      },
    });
  }
}

module.exports = ElectiveOfficeTerm;
