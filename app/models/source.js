const Base = require('./base');

class Source extends Base {
  static tableName = 'data_sources';

  static perPage = 40;

  /* eslint-disable camelcase */
  static fieldNames = {
    id: true,
    type: true,
    format: true,
    title: true,
    year: true,
    quarter: true,
    public_url: true,
    retrieved_at: true,
  };
  /* eslint-enable camelcase */

  static types = {
    activity: 'activity',
    registration: 'registration',
  };

  static adapt(result) {
    const adapted = {
      id: result.id,
      type: result.type,
      format: result.format,
      title: result.title,
      year: result.year,
      quarter: result.quarter,
      publicUrl: result.public_url,
      retrievedDate: super.readableDate(result.retrieved_at),
    };

    if (result.total) {
      adapted.incidents = {
        stats: {
          total: result.total,
        },
      };
    }

    return adapted;
  }

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
