const IncidentedObject = require('./incidented-object');

class Person extends IncidentedObject {
  static tableName = 'people';
  static linkKey = 'person';

  static perPage = 40;

  static fieldNames = {
    id:           { select: true, },
    identical_id: { select: true, adapt: false }, // eslint-disable-line camelcase
    type:         { select: true, },
    name:         { select: true, },
  };

  adaptRoles(value) {
    return value?.split(',') ?? [];
  }

  adapt(result) {
    return this.adaptResult(result, {
      roles: this.adaptRoles(result.roles),
    });
  }

  get hasMoved() {
    return Boolean(this.data.identical_id);
  }

  get identicalId() {
    return this.data.identical_id;
  }
}

module.exports = Person;
