const Base = require('./shared/base');

const EntityLobbyistRegistrationsTable = require('../services/tables/entity-lobbyist-registrations');

class EntityLobbyistRegistration extends Base {
  static table = EntityLobbyistRegistrationsTable;

  adapt(result) {
    return {
      quarter: result.quarter,
      year: result.year,
    };
  }
}

module.exports = EntityLobbyistRegistration;
