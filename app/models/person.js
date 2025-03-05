const IncidentedObject = require('./incidented-object');

class Person extends IncidentedObject {
  static tableName = 'people';

  static perPage = 40;

  static fieldNames = {
    id:   { select: true, },
    type: { select: true, },
    name: { select: true, },
  };

  adaptRoles(value) {
    return value?.split(',') ?? [];
  }

  adapt(result) {
    return this.adaptResult(result, {
      roles: this.adaptRoles(result.roles),
    });
  }
}

module.exports = Person;
