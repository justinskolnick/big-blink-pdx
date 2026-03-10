const Base = require('./shared/base');

const IncidentsTable = require('../services/tables/incidents');

class Incident extends Base {
  static table = IncidentsTable;

  static linkKey = 'incident';

  static perPage = 15;

  static adaptContactTypes(str) {
    return str.split(';').map(item => item.trim());
  }

  adaptReadableDateRange(result) {
    if (result.contact_date_end) {
      return this.constructor.readableDateRange(result.contact_date, result.contact_date_end);
    }

    return null;
  }

  adapt(result) {
    return this.adaptResult(result, {
      contactDateRange: this.adaptReadableDateRange(result),
      entityName: result.entity,
      raw: {
        dateStart: result.contact_date,
        dateEnd: result.contact_date_end,
        officials: result.officials,
        lobbyists: result.lobbyists,
      },
    });
  }
}

module.exports = Incident;
