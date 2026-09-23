const Base = require('./shared/base');

const { getRegionFromAbbreviation } = require('../lib/location');

const EntityLobbyistLocationsTable = require('../services/tables/entity-lobbyist-locations');

class EntityLobbyistLocation extends Base {
  static table = EntityLobbyistLocationsTable;

  static readableRegion(str) {
    return getRegionFromAbbreviation(str);
  }

  adapt(result) {
    return this.adaptResult(result, {
      region: this.constructor.readableRegion(result.region),
    });
  }
}

module.exports = EntityLobbyistLocation;
