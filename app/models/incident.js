const Base = require('./base');

class Incident extends Base {
  static tableName = 'incidents';

  static perPage = 15;

  static fieldNames = {
    id:             { select: true, },
    entity:         { select: true, },
    entity_id:      { select: true, }, // eslint-disable-line camelcase
    contact_date:   { select: true, adapt: { method: this.readableDate } }, // eslint-disable-line camelcase
    contact_type:   { select: true, }, // eslint-disable-line camelcase
    category:       { select: true, },
    data_source_id: { select: true, adapt: { as: 'sourceId' } }, // eslint-disable-line camelcase
    topic:          { select: true, },
    officials:      { select: true, },
    lobbyists:      { select: true, },
    notes:          { select: true, },
  };

  static adapt(result) {
    return this.adaptResult(result, {
      entityName: result.entity,
      raw: {
        officials: result.officials,
        lobbyists: result.lobbyists,
      },
    });
  }
}

module.exports = Incident;
