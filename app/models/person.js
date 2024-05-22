const Base = require('./base');

class Person extends Base {
  static tableName = 'people';

  static perPage = 40;

  static fieldNames = {
    id: true,
    type: true,
    name: true,
  };

  static adapt(result) {
    const adapted = {
      id: result.id,
      type: result.type,
      name: result.name,
      roles: result.roles?.split(',') ?? [],
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

module.exports = Person;
