const Base = require('./base');

class IncidentAttendee extends Base {
  static tableName = 'incident_attendees';

  static perPage = 20;

  /* eslint-disable camelcase */
  static fieldNames = {
    id: true,
    incident_id: false,
    person_id: false,
    appears_as: true,
    role: true,
  };
  /* eslint-enable camelcase */

  static roles = {
    lobbyist: 'lobbyist',
    official: 'official',
  };

  static adapt(result) {
    return {
      id: result.id,
      as: result.appears_as,
      person: {
        id: result.person_id,
        name: result.name,
        type: result.type,
      },
    };
  }
}

module.exports = IncidentAttendee;
