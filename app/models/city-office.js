const Base = require('./shared/base');

const CityOfficesTable = require('../services/tables/city-offices');

class CityOffice extends Base {
  static table = CityOfficesTable;
}

module.exports = CityOffice;
