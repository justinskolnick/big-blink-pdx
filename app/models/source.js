const Base = require('./base');

class Source extends Base {
  static tableName = 'data_sources';

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
