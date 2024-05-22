const Base = require('./base');

class Incident extends Base {
  static tableName = 'incidents';

  static perPage = 15;

  /* eslint-disable camelcase */
  static fieldNames = {
    id: true,
    entity: true,
    entity_id: true,
    contact_date: true,
    contact_type: true,
    category: true,
    data_source_id: true,
    topic: true,
    officials: true,
    lobbyists: true,
    notes: true,
  };
  /* eslint-enable camelcase */

  static adapt(result) {
    return {
      id: result.id,
      entity: result.entity,
      entityId: result.entity_id,
      entityName: result.entity,
      contactDate: super.readableDate(result.contact_date),
      contactType: result.contact_type,
      category: result.category,
      sourceId: result.data_source_id,
      topic: result.topic,
      officials: result.officials,
      lobbyists: result.lobbyists,
      notes: result.notes,
      raw: {
        officials: result.officials,
        lobbyists: result.lobbyists,
      },
    };
  }
}

module.exports = Incident;
