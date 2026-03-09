const Base = require('./shared/base');

const EntityLobbyistLocationsTable = require('../services/tables/entity-lobbyist-locations');

class EntityLobbyistLocation extends Base {
  static table = EntityLobbyistLocationsTable;
}

module.exports = EntityLobbyistLocation;
