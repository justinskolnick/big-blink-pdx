const result = require('../__mocks__/incident-attendee/result-official');

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

describe('personFields()', () => {
  test('returns the expected fields', () => {
    expect(IncidentAttendee.personFields()).toEqual([
      'people.id',
      'people.name',
      'people.pernr',
      'people.type',
    ]);
  });

  describe('with an excluded field', () => {
    test('returns the expected fields', () => {
      expect(IncidentAttendee.personFields(['id'])).toEqual([
        'people.name',
        'people.pernr',
        'people.type',
      ]);
    });
  });
});

describe('primaryKey()', () => {
  test('returns the expected field', () => {
    expect(IncidentAttendee.primaryKey()).toBe('incident_attendees.id');
  });
});

describe('foreignKey()', () => {
  test('returns the expected field', () => {
    expect(IncidentAttendee.foreignKey()).toBe('incident_attendee_id');
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
          list: [
            'official',
          ],
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
          list: [
            'official',
          ],
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
