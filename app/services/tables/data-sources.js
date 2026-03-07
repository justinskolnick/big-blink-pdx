const Table = require('../../lib/db/mysql/table');

class DataSources extends Table {
  static perPage = 40;

  /* eslint-disable camelcase */
  static fieldNames = {
    id:                     { select: true, },
    type:                   { select: true, },
    format:                 { select: true, },
    title:                  { select: true, },
    year:                   { select: true, },
    quarter:                { select: true, },
    quarter_id:             { select: false, },
    public_url:             { select: true, },
    is_via_public_records:  { select: true, adapt: { method: this.readableBoolean } },
    retrieved_at:           { select: true, adapt: { as: 'retrievedDate', method: this.readableDate } },
  };
  /* eslint-enable camelcase */
}

module.exports = DataSources;
