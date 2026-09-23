const Table = require('../../lib/db/mysql/table');

class People extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:               { type: 'integer',  select: true, },
    identical_id:     { type: 'integer',  select: true,   adapt: false, },
    pernr:            { type: 'integer',  select: true, },
    type:             { type: 'string',   select: true, },
    name:             { type: 'string',   select: true, },
    given:            { type: 'string',   select: true,   adapt: false, },
    family:           { type: 'string',   select: false, },
    pronoun_subject:  { type: 'string',   select: true,   adapt: false, },
  };
  /* eslint-enable camelcase */
}

module.exports = People;
