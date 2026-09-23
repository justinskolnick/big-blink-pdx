const Table = require('../../lib/db/mysql/table');

class EntityLobbyistRegistrations extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:             { type: 'integer',  select: true, },
    data_source_id: { type: 'integer',  select: false, },
    entity_id:      { type: 'integer',  select: true, },
    person_id:      { type: 'integer',  select: true, },
  };
  /* eslint-enable camelcase */
}

module.exports = EntityLobbyistRegistrations;
