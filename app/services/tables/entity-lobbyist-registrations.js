const Table = require('../../lib/db/mysql/table');

class EntityLobbyistRegistrations extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:             { select: true, },
    data_source_id: { select: false, },
    entity_id:      { select: true, },
    person_id:      { select: true, },
  };
  /* eslint-enable camelcase */
}

module.exports = EntityLobbyistRegistrations;
