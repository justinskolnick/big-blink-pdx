const IncidentAttendee = require('../incident-attendee');

describe('tableName', () => {
  test('returns the expected tableName', () => {
    expect(IncidentAttendee.tableName).toBe('incident_attendees');
  });
});

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(IncidentAttendee.fields()).toEqual([
      'incident_attendees.id',
      'incident_attendees.appears_as',
      'incident_attendees.role',
    ]);
  });
});

describe('adapt()', () => {
  /* eslint-disable camelcase */
  const result = {
    id: 123,
    appears_as: 'Orbit, Henry',
    role: 'official',
    person_id: 321,
    name: 'Henry Orbit',
    type: 'person',
  };
  /* eslint-enable camelcase */

  test('adapts a result', () => {
    const incidentAttendee = new IncidentAttendee(result);

    expect(incidentAttendee.adapted).toEqual({
      id: 123,
      as: 'Orbit, Henry',
      person: {
        id: 321,
        links: {
          self: '/people/321',
        },
        name: 'Henry Orbit',
        roles: [
          'official',
        ],
        type: 'person',
      },
    });
  });
});

describe('setData()', () => {
  test('sets data', () => {
    /* eslint-disable camelcase */
    const incidentAttendee = new IncidentAttendee({
      id: 123,
      appears_as: 'Orbit, Henry',
      role: 'official',
      person_id: 321,
      name: 'Henry Orbit',
      type: 'person',
      x: 'y',
    });
    /* eslint-enable camelcase */

    incidentAttendee.setData('z', 'abc');

    /* eslint-disable camelcase */
    expect(incidentAttendee.data).toEqual({
      appears_as: 'Orbit, Henry',
      id: 123,
      name: 'Henry Orbit',
      person_id: 321,
      role: 'official',
      type: 'person',
      x: 'y',
      z: 'abc',
    });
    /* eslint-enable camelcase */

    expect(incidentAttendee.adapted).toEqual({
      as: 'Orbit, Henry',
      id: 123,
      person: {
        id: 321,
        links: {
          self: '/people/321',
        },
        name: 'Henry Orbit',
        roles: [
          'official',
        ],
        type: 'person',
      },
    });
  });
});
