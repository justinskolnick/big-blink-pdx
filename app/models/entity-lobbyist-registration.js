const Base = require('./base');

class EntityLobbyistRegistration extends Base {
  static tableName = 'entity_lobbyist_registrations';

  /* eslint-disable camelcase */
  static fieldNames = {
    id: true,
    data_source_id: true,
    entity_id: true,
    person_id: true,
  };
  /* eslint-enable camelcase */

  static adapt(result) {
    return {
      quarter: result.quarter,
      year: result.year,
    };
  }
}

module.exports = EntityLobbyistRegistration;
