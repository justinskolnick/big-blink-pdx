const { isTruthy } = require('../lib/util');

const Base = require('./shared/base');

const CityOfficesTable = require('../services/tables/city-offices');

class CityOffice extends Base {
  static table = CityOfficesTable;

  isCityCommissioner() {
    return this.office === 'City Commissioner';
  }

  isCityCouncilor() {
    return this.office === 'City Councilor';
  }

  isElected() {
    return isTruthy(this.getData('is_elected'));
  }

  hasDateStart() {
    return this.getData('date_start') !== null;
  }

  hasDateEnd() {
    return this.getData('date_end') !== null;
  }

  isCurrent() {
    const dateStart = new Date(this.getData('date_start'));
    const now = new Date();

    return (!this.hasDateStart() && !this.hasDateEnd()) || (dateStart < now && !this.hasDateEnd());
  }

  get id() {
    return this.getData('id');
  }

  get office() {
    return this.getData('office');
  }
}

module.exports = CityOffice;
