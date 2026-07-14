const Base = require('./shared/base');

const { getRegionFromAbbreviation } = require('../lib/location');
const EntityLobbyistLocationsTable = require('../services/tables/entity-lobbyist-locations');

class EntityLobbyistLocation extends Base {
  static table = EntityLobbyistLocationsTable;

  static readableRegion(str) {
    return getRegionFromAbbreviation(str);
  }
}

module.exports = EntityLobbyistLocation;
