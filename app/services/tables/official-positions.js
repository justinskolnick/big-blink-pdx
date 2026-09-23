const Table = require('../../lib/db/mysql/table');

class OfficialPositions extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:                   { type: 'integer',  select: false, },
    pernr:                { type: 'integer',  select: true,   adapt: false, },
    name:                 { type: 'string',   select: true,   adapt: false, },
    date_start:           { type: 'date',     select: true,   adapt: false, },
    date_end:             { type: 'date',     select: true,   adapt: false, },
    date_final:           { type: 'date',     select: true,   adapt: false, },
    is_withdrawn:         { type: 'boolean',  select: true,   adapt: false, },
    is_elected:           { type: 'boolean',  select: true,   adapt: false, },
    office:               { type: 'string',   select: true,   adapt: false, },
    position:             { type: 'integer',  select: true,   adapt: false, },
    district:             { type: 'integer',  select: true,   adapt: false, },
    responsible_to_pernr: { type: 'integer',  select: true,   adapt: false, },
    area:                 { type: 'string',   select: true,   adapt: false, },
    assignment:           { type: 'string',   select: true,   adapt: false, },
    classification:       { type: 'string',   select: true,   adapt: false, },
    rank:                 { type: 'string',   select: true,   adapt: false, },
    is_chief:             { type: 'boolean',  select: true,   adapt: false, },
    role:                 { type: 'string',   select: true,   adapt: false, },
  };
  /* eslint-enable camelcase */
}

module.exports = OfficialPositions;
