const Table = require('../../lib/db/mysql/table');

class Incidents extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:               { type: 'integer', },
    entity:           { type: 'string', },
    entity_id:        { type: 'integer', },
    contact_date:     { type: 'date', },
    contact_date_end: { type: 'date', },
    contact_type:     { type: 'string',   adapt: false, },
    category:         { type: 'string', },
    data_source_id:   { type: 'integer',  adapt: false, },
    topic:            { type: 'string', },
    officials:        { type: 'string', },
    lobbyists:        { type: 'string', },
    notes:            { type: 'string', },
  };
  /* eslint-enable camelcase */

  static defaultFields = [
    'id',
    'entity',
    'entity_id',
    'contact_date',
    'contact_date_end',
    'contact_type',
    'category',
    'data_source_id',
    'topic',
    'officials',
    'lobbyists',
    'notes',
  ];

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
