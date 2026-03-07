const Table = require('../../lib/db/mysql/table');

class Incidents extends Table {
  static perPage = 15;

  /* eslint-disable camelcase */
  static fieldNames = {
    id:               { select: true, },
    entity:           { select: true, },
    entity_id:        { select: true, },
    contact_date:     { select: true, adapt: { method: this.readableDate } },
    contact_date_end: { select: true, adapt: { method: this.readableDate } },
    contact_type:     { select: true, adapt: { as: 'contactTypes', method: this.adaptContactTypes, }, },
    category:         { select: true, },
    data_source_id:   { select: true, adapt: { as: 'sourceId' } },
    topic:            { select: true, },
    officials:        { select: true, },
    lobbyists:        { select: true, },
    notes:            { select: true, },
  };
  /* eslint-enable camelcase */

  static adaptContactTypes(str) {
    return str.split(';').map(item => item.trim());
  }

  static dateRangeFields() {
    return ['contact_date', 'contact_date_end']
      .map(fieldName => this.field(fieldName, true));
  }
}

module.exports = Incidents;
