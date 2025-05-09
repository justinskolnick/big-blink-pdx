const {
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../config/constants');

const Base = require('./base');
const Person = require('./person');

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

  adapt(result) {
    const data = {
      id: result.person_id,
      name: result.name,
      roles: result.role,
      type: result.type,
    };
    const person = new Person(data);

    const adapted = this.adaptResult(result, {
      person: person.adapted,
    });

    delete adapted.role;

    return adapted;
  }
}

module.exports = IncidentAttendee;
