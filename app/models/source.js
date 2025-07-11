const IncidentedObject = require('./incidented-object');

class Source extends IncidentedObject {
  static tableName = 'data_sources';
  static linkKey = 'source';

  static perPage = 40;

  static fieldNames = {
    id:           { select: true, },
    type:         { select: true, },
    format:       { select: true, },
    title:        { select: true, },
    year:         { select: true, },
    quarter:      { select: true, },
    quarter_id:   { select: false, }, // eslint-disable-line camelcase
    public_url:   { select: true, }, // eslint-disable-line camelcase
    retrieved_at: { select: true, adapt: { as: 'retrievedDate', method: this.readableDate } }, // eslint-disable-line camelcase
  };

  static labels = {
    activity: 'Lobbying activity',
    registration: 'Lobbying registration',
  };

  static types = {
    activity: 'activity',
    registration: 'registration',
  };

  static adaptEntity(result) {
    const adapted = {
      entity: {
        id: result.id,
        name: result.name,
      },
    };

    if (result.total) {
      adapted.total = result.total;
    }

    return adapted;
  }
}

module.exports = Source;
