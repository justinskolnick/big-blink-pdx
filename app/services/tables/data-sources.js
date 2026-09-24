const Table = require('../../lib/db/mysql/table');

class DataSources extends Table {
  static types = {
    activity: 'activity',
    election: 'election',
    personnel: 'personnel',
    registration: 'registration',
  };

  /* eslint-disable camelcase */
  static fieldNames = {
    id:                     { type: 'integer', },
    type:                   { type: 'string', },
    format:                 { type: 'string', },
    title:                  { type: 'string', },
    year:                   { type: 'integer', },
    quarter:                { type: 'integer', },
    quarter_id:             { type: 'integer', },
    month:                  { type: 'integer', },
    public_url:             { type: 'string', },
    is_via_public_records:  { type: 'boolean', },
    retrieved_at:           { type: 'timestamp',  adapt: false, },
  };
  /* eslint-enable camelcase */

  static defaultFields = [
    'id',
    'type',
    'format',
    'title',
    'year',
    'quarter',
    'month',
    'public_url',
    'is_via_public_records',
    'retrieved_at',
  ];
}

module.exports = DataSources;
