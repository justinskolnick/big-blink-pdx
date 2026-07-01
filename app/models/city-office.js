const { isTruthy } = require('../lib/util');

const Base = require('./shared/base');

const CityOfficesTable = require('../services/tables/city-offices');

class CityOffice extends Base {
  static table = CityOfficesTable;

  get office() {
    return this.getData('office');
  }

  get isCityCommissioner() {
    return this.office === 'City Commissioner';
  }

  get isCityCouncilor() {
    return this.office === 'City Councilor';
  }

  get isElected() {
    return isTruthy(this.getData('is_elected'));
  }

  get hasDateStart() {
    return this.getData('date_start') !== null;
  }

  get hasDateEnd() {
    return this.getData('date_end') !== null;
  }

  get isCurrent() {
    const dateStart = new Date(this.getData('date_start'));
    const now = new Date();

    return (!this.hasDateStart && !this.hasDateEnd) || (dateStart < now && !this.hasDateEnd);
  }
}

module.exports = CityOffice;
