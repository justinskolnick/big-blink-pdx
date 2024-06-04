const Base = require('./base');

class EntityLobbyistLocation extends Base {
  static tableName = 'entity_lobbyist_locations';

  static fieldNames = {
    id:             { select: true, },
    data_source_id: { select: false, }, // eslint-disable-line camelcase
    entity_id:      { select: false, }, // eslint-disable-line camelcase
    city:           { select: true, },
    region:         { select: true, },
  };
}

module.exports = EntityLobbyistLocation;
