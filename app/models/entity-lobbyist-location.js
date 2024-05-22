const Base = require('./base');

class EntityLobbyistLocation extends Base {
  static tableName = 'entity_lobbyist_locations';

  /* eslint-disable camelcase */
  static fieldNames = {
    id: true,
    data_source_id: false,
    entity_id: true,
    city: true,
    region: true,
  };
  /* eslint-enable camelcase */

  static adapt(result) {
    return {
      id: result.id,
      city: result.city,
      region: result.region,
    };
  }
}

module.exports = EntityLobbyistLocation;
