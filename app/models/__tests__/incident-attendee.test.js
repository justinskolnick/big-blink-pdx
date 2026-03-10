const result = require('../__mocks__/incident-attendee/result-official');

const IncidentAttendee = require('../incident-attendee');

describe('className()', () => {
  test('returns the expected field', () => {
    expect(IncidentAttendee.className()).toBe('IncidentAttendee');
  });
});

describe('adapt()', () => {
  test('adapts a result', () => {
    const incidentAttendee = new IncidentAttendee(result);
    incidentAttendee.setPersonObject();

    expect(incidentAttendee.adapted).toEqual({
      id: 123,
      as: 'Orbit, Henry',
      person: {
        id: 321,
        links: {
          self: '/people/321',
        },
        name: 'Henry Orbit',
        pernr: 654987,
        roles: {
          label: 'Roles and Associations',
          list: [
            'official',
          ],
          options: {
            lobbyist: false,
            official: true,
          },
        },
        type: 'person',
      },
    });
  });
});

describe('setData()', () => {
  test('sets data', () => {
    const resultWithExtraData = {
      ...result,
      x: 'y',
    };

    const incidentAttendee = new IncidentAttendee(resultWithExtraData);
    incidentAttendee.setData('z', 'abc');
    incidentAttendee.setPersonObject();

    /* eslint-disable camelcase */
    expect(incidentAttendee.data).toEqual({
      appears_as: 'Orbit, Henry',
      id: 123,
      name: 'Henry Orbit',
      person_id: 321,
      pernr: 654987,
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
        pernr: 654987,
        roles: {
          label: 'Roles and Associations',
          list: [
            'official',
          ],
          options: {
            lobbyist: false,
            official: true,
          },
        },
        type: 'person',
      },
    });
  });
});

describe('hasPerson()', () => {
  test('returns the expected object', () => {

    const incidentAttendee = new IncidentAttendee(result);
    incidentAttendee.setPersonObject();

    expect(incidentAttendee.hasPerson).toBe(true);
  });
});
