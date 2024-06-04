const Base = require('./base');

class EntityLobbyistRegistration extends Base {
  static tableName = 'entity_lobbyist_registrations';

  static fieldNames = {
    id:             { select: true, },
    data_source_id: { select: false, }, // eslint-disable-line camelcase
    entity_id:      { select: true, }, // eslint-disable-line camelcase
    person_id:      { select: true, }, // eslint-disable-line camelcase
  };

  static adapt(result) {
    return {
      quarter: result.quarter,
      year: result.year,
    };
  }
}

module.exports = EntityLobbyistRegistration;
