const Table = require('../../lib/db/mysql/table');

class EntityLobbyistLocations extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:             { select: true, },
    data_source_id: { select: false, },
    entity_id:      { select: false, },
    city:           { select: true, },
    region:         { select: true, adapt: { method: 'readableRegion' } },
  };
  /* eslint-enable camelcase */
}

module.exports = EntityLobbyistLocations;
