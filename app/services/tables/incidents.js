const Table = require('../../lib/db/mysql/table');

class Incidents extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:               { type: 'integer',  select: true, },
    entity:           { type: 'string',   select: true, },
    entity_id:        { type: 'integer',  select: true, },
    contact_date:     { type: 'date',     select: true, },
    contact_date_end: { type: 'date',     select: true, },
    contact_type:     { type: 'string',   select: true,   adapt: false, },
    category:         { type: 'string',   select: true, },
    data_source_id:   { type: 'integer',  select: true,   adapt: false, },
    topic:            { type: 'string',   select: true, },
    officials:        { type: 'string',   select: true, },
    lobbyists:        { type: 'string',   select: true, },
    notes:            { type: 'string',   select: true, },
  };
  /* eslint-enable camelcase */

  static dateRangeFields() {
    const fieldNames = [
      'contact_date',
      'contact_date_end',
    ];

    return fieldNames
      .map(fieldName => this.field(fieldName, true));
  }
}

module.exports = Incidents;
