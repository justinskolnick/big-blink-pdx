const Table = require('../../lib/db/mysql/table');

class EntityLobbyistLocations extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:             { type: 'integer', },
    data_source_id: { type: 'integer', },
    entity_id:      { type: 'integer', },
    city:           { type: 'string', },
    region:         { type: 'string',   adapt: false, },
  };
  /* eslint-enable camelcase */

  static defaultFields = [
    'id',
    'city',
    'region',
  ];
}

module.exports = EntityLobbyistLocations;
