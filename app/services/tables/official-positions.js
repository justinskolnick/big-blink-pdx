const Table = require('../../lib/db/mysql/table');

class OfficialPositions extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:                   { select: false, },
    pernr:                { select: true, adapt: false, },
    name:                 { select: true, adapt: false, },
    date_start:           { select: true, adapt: false, },
    date_end:             { select: true, adapt: false, },
    date_final:           { select: true, adapt: false, },
    is_withdrawn:         { select: true, adapt: false, },
    is_elected:           { select: true, adapt: false, },
    office:               { select: true, adapt: false, },
    position:             { select: true, adapt: false, },
    district:             { select: true, adapt: false, },
    responsible_to_pernr: { select: true, adapt: false, },
    area:                 { select: true, adapt: false, },
    assignment:           { select: true, adapt: false, },
    classification:       { select: true, adapt: false, },
    rank:                 { select: true, adapt: false, },
    is_chief:             { select: true, adapt: false, },
    role:                 { select: true, adapt: false, },
  };
  /* eslint-enable camelcase */
}

module.exports = OfficialPositions;
