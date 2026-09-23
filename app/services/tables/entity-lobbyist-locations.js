const Table = require('../../lib/db/mysql/table');

class EntityLobbyistLocations extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:             { type: 'integer',  select: true, },
    data_source_id: { type: 'integer',  select: false, },
    entity_id:      { type: 'integer',  select: false, },
    city:           { type: 'string',   select: true, },
    region:         { type: 'string',   select: true,   adapt: false, },
  };
  /* eslint-enable camelcase */
}

module.exports = EntityLobbyistLocations;
