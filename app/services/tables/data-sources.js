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
    id:                     { type: 'integer',    select: true, },
    type:                   { type: 'string',     select: true, },
    format:                 { type: 'string',     select: true, },
    title:                  { type: 'string',     select: true, },
    year:                   { type: 'integer',    select: true, },
    quarter:                { type: 'integer',    select: true, },
    quarter_id:             { type: 'integer',    select: false, },
    month:                  { type: 'integer',    select: true, },
    public_url:             { type: 'string',     select: true, },
    is_via_public_records:  { type: 'boolean',    select: true, },
    retrieved_at:           { type: 'timestamp',  select: true,   adapt: false, },
  };
  /* eslint-enable camelcase */
}

module.exports = DataSources;
