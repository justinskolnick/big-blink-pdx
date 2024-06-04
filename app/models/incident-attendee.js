const Base = require('./base');

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
    lobbyist: 'lobbyist',
    official: 'official',
  };

  static adapt(result) {
    const adapted = this.adaptResult(result, {
      person: {
        id: result.person_id,
        name: result.name,
        type: result.type,
      },
    });
    delete adapted.role;

    return adapted;
  }
}

module.exports = IncidentAttendee;
