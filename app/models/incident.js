const Base = require('./shared/base');

class Incident extends Base {
  static tableName = 'incidents';
  static linkKey = 'incident';

  static perPage = 15;

  static fieldNames = {
    id:               { select: true, },
    entity:           { select: true, },
    entity_id:        { select: true, }, // eslint-disable-line camelcase
    contact_date:     { select: true, adapt: { method: this.readableDate } }, // eslint-disable-line camelcase
    contact_date_end: { select: true, adapt: { method: this.readableDate } }, // eslint-disable-line camelcase
    contact_type:     { select: true, adapt: { as: 'contactTypes', method: this.adaptContactTypes, }, }, // eslint-disable-line camelcase
    category:         { select: true, },
    data_source_id:   { select: true, adapt: { as: 'sourceId' } }, // eslint-disable-line camelcase
    topic:            { select: true, },
    officials:        { select: true, },
    lobbyists:        { select: true, },
    notes:            { select: true, },
  };

  static adaptContactTypes(str) {
    return str.split(';').map(item => item.trim());
  }

  static dateRangeFields() {
    return ['contact_date', 'contact_date_end']
      .map(fieldName => this.field(fieldName, true));
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
