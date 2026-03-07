const Incidents = require('../incidents');

describe('className()', () => {
  test('returns the expected field', () => {
    expect(Incidents.className()).toBe('Incidents');
  });
});

describe('tableName()', () => {
  test('returns the expected tableName', () => {
    expect(Incidents.tableName()).toBe('incidents');
  });
});

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(Incidents.fields()).toEqual([
      'incidents.id',
      'incidents.entity',
      'incidents.entity_id',
      'incidents.contact_date',
      'incidents.contact_date_end',
      'incidents.contact_type',
      'incidents.category',
      'incidents.data_source_id',
      'incidents.topic',
      'incidents.officials',
      'incidents.lobbyists',
      'incidents.notes',
    ]);
  });
});

describe('dateRangeFields()', () => {
  test('returns the expected fields', () => {
    expect(Incidents.dateRangeFields()).toEqual([
      'incidents.contact_date',
      'incidents.contact_date_end',
    ]);
  });
});

describe('primaryKey()', () => {
  test('returns the expected field', () => {
    expect(Incidents.primaryKey()).toBe('incidents.id');
  });
});

describe('foreignKey()', () => {
  test('returns the expected field', () => {
    expect(Incidents.foreignKey()).toBe('incident_id');
  });
});
