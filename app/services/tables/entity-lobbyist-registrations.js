const Table = require('../../lib/db/mysql/table');

class EntityLobbyistRegistrations extends Table {
  /* eslint-disable camelcase */
  static fieldNames = {
    id:             { type: 'integer', },
    data_source_id: { type: 'integer', },
    entity_id:      { type: 'integer', },
    person_id:      { type: 'integer', },
  };
  /* eslint-enable camelcase */

  static defaultFields = [
    'id',
    'entity_id',
    'person_id',
  ];
}

module.exports = EntityLobbyistRegistrations;
