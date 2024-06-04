const Base = require('./base');

class Person extends Base {
  static tableName = 'people';

  static perPage = 40;

  static fieldNames = {
    id:   { select: true, },
    type: { select: true, },
    name: { select: true, },
  };

  static adaptRoles(value) {
    return value?.split(',') ?? [];
  }

  static adapt(result) {
    return this.adaptResult(result, {
      roles: this.adaptRoles(result.roles),
    });
  }
}

module.exports = Person;
