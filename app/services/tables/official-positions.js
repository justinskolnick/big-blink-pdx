const Table = require('../../lib/db/mysql/table');

class OfficialPositions extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:                   { type: 'integer', },
    pernr:                { type: 'integer',  adapt: false, },
    name:                 { type: 'string',   adapt: false, },
    date_start:           { type: 'date',     adapt: false, },
    date_end:             { type: 'date',     adapt: false, },
    date_final:           { type: 'date',     adapt: false, },
    is_withdrawn:         { type: 'boolean',  adapt: false, },
    is_elected:           { type: 'boolean',  adapt: false, },
    office:               { type: 'string',   adapt: false, },
    position:             { type: 'integer',  adapt: false, },
    district:             { type: 'integer',  adapt: false, },
    responsible_to_pernr: { type: 'integer',  adapt: false, },
    area:                 { type: 'string',   adapt: false, },
    assignment:           { type: 'string',   adapt: false, },
    classification:       { type: 'string',   adapt: false, },
    rank:                 { type: 'string',   adapt: false, },
    is_chief:             { type: 'boolean',  adapt: false, },
    role:                 { type: 'string',   adapt: false, },
  };
  /* eslint-enable camelcase */

  static defaultFields = [
    'pernr',
    'name',
    'date_start',
    'date_end',
    'date_final',
    'is_withdrawn',
    'is_elected',
    'office',
    'position',
    'district',
    'responsible_to_pernr',
    'area',
    'assignment',
    'classification',
    'rank',
    'is_chief',
    'role',
  ];
}

module.exports = OfficialPositions;
