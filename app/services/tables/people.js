const Table = require('../../lib/db/mysql/table');

class People extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:               { type: 'integer', },
    identical_id:     { type: 'integer',  adapt: false, },
    pernr:            { type: 'integer', },
    type:             { type: 'string', },
    name:             { type: 'string', },
    given:            { type: 'string',   adapt: false, },
    family:           { type: 'string', },
    pronoun_subject:  { type: 'string',   adapt: false, },
  };
  /* eslint-enable camelcase */

  static defaultFields = [
    'id',
    'identical_id',
    'pernr',
    'type',
    'name',
    'given',
    'pronoun_subject',
  ];
}

module.exports = People;
