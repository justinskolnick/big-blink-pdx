const Base = require('./shared/base');

class OfficialPosition extends Base {
  static tableName = 'official_positions';

  /* eslint-disable camelcase */
  static fieldNames = {
    id:                   { select: false, },
    pernr:                { select: true, },
    name:                 { select: true, },
    date_start:           { select: true, },
    date_end:             { select: true, },
    is_withdrawn:         { select: true, adapt: { method: this.readableBoolean }, },
    is_elected:           { select: true, adapt: { method: this.readableBoolean }, },
    office:               { select: true, },
    position:             { select: true, },
    district:             { select: true, },
    responsible_to_pernr: { select: true, },
    area:                 { select: true, },
    assignment:           { select: true, },
    classification:       { select: true, },
    rank:                 { select: true, },
    is_chief:             { select: true, adapt: { method: this.readableBoolean }, },
    role:                 { select: true, },
  };
  /* eslint-enable camelcase */
}

module.exports = OfficialPosition;
