const IncidentAttendee = require('../incident-attendee');

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
  test('adapts a result', () => {
    expect(IncidentAttendee.adapt({
      id: 123,
      appears_as: 'Orbit, Henry',
      role: 'official',
      person_id: 321,
      name: 'Henry Orbit',
      type: 'person',
    })).toEqual({
      id: 123,
      as: 'Orbit, Henry',
      person: {
        id: 321,
        name: 'Henry Orbit',
        type: 'person',
      },
    });
  });
  /* eslint-enable camelcase */

  test('sets data', () => {
    const incidentAttendee = new IncidentAttendee({
      x: 'y',
    });

    incidentAttendee.setData('z', 'abc');

    expect(incidentAttendee.data).toEqual({
      x: 'y',
      z: 'abc',
    });

    expect(incidentAttendee.adapted).toEqual({
      as: undefined,
      id: undefined,
      person: {
        id: undefined,
        name: undefined,
        type: undefined,
      },
    });
  });
});
