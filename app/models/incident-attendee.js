const {
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../config/constants');

const { isEmpty } = require('../lib/util');

const Base = require('./shared/base');
const Person = require('./person/person');

class IncidentAttendee extends Base {
  static tableName = 'incident_attendees';

  static perPage = 20;

  static fieldNames = {
    id:           { select: true, },
    incident_id:  { select: false, }, // eslint-disable-line camelcase
    person_id:    { select: false, }, // eslint-disable-line camelcase
    appears_as:   { select: true, adapt: { as: 'as' } }, // eslint-disable-line camelcase
    role:         { select: true, },
  };

  static roles = {
    lobbyist: ROLE_LOBBYIST,
    official: ROLE_OFFICIAL,
  };

  static personFields(without = []) {
    const fieldNames = [
      'id',
      'name',
      'pernr',
      'type',
    ];

    return fieldNames
      .filter(fieldName => !without.includes(fieldName))
      .map(fieldName => Person.field(fieldName));
  }

  person = null;

  setPerson(values) {
    this.person = new Person(values);
  }

  setPersonObject() {
    const values = {
      id: this.getData('person_id'),
      name: this.getData('name'),
      pernr: this.getData('pernr'),
      roles: this.getData('role'),
      type: this.getData('type'),
    };

    this.setPerson(values);
  }

  adapt(result) {
    const person = this.hasPerson ? this.person.adapted : this.person;
    const adapted = this.adaptResult(result, {
      person,
    });

    delete adapted.role;

    return adapted;
  }

  get hasPerson() {
    return !isEmpty(this.person);
  }
}

module.exports = IncidentAttendee;
