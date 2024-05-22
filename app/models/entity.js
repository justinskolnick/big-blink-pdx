const Base = require('./base');

class Entity extends Base {
  static tableName = 'entities';

  static perPage = 40;

  static fieldNames = {
    id: true,
    name: true,
    domain: true,
  };

  static adapt(result) {
    const adapted = {
      id: result.id,
      name: result.name,
      domain: result.domain,
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
}

module.exports = Entity;
