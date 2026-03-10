const IncidentAttendees = require('../incident-attendees');

describe('className()', () => {
  test('returns the expected field', () => {
    expect(IncidentAttendees.className()).toBe('IncidentAttendees');
  });
});

describe('tableName()', () => {
  test('returns the expected tableName', () => {
    expect(IncidentAttendees.tableName()).toBe('incident_attendees');
  });
});

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(IncidentAttendees.fields()).toEqual([
      'incident_attendees.id',
      'incident_attendees.appears_as',
      'incident_attendees.role',
    ]);
  });
});

describe('personFields()', () => {
  test('returns the expected fields', () => {
    expect(IncidentAttendees.personFields()).toEqual([
      'people.id',
      'people.name',
      'people.pernr',
      'people.type',
    ]);
  });

  describe('with an excluded field', () => {
    test('returns the expected fields', () => {
      expect(IncidentAttendees.personFields(['id'])).toEqual([
        'people.name',
        'people.pernr',
        'people.type',
      ]);
    });
  });
});

describe('primaryKey()', () => {
  test('returns the expected field', () => {
    expect(IncidentAttendees.primaryKey()).toBe('incident_attendees.id');
  });
});

describe('foreignKey()', () => {
  test('returns the expected field', () => {
    expect(IncidentAttendees.foreignKey()).toBe('incident_attendee_id');
  });
});
