const Elections = require('../elections');

describe('className()', () => {
  test('returns the expected field', () => {
    expect(Elections.className()).toBe('Elections');
  });
});

describe('tableName()', () => {
  test('returns the expected tableName', () => {
    expect(Elections.tableName()).toBe('elections');
  });
});

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(Elections.fields()).toEqual([
      'elections.id',
      'elections.year',
      'elections.type',
      'elections.election_day',
    ]);
  });
});

describe('primaryKey()', () => {
  test('returns the expected field', () => {
    expect(Elections.primaryKey()).toBe('elections.id');
  });
});

describe('foreignKey()', () => {
  test('returns the expected field', () => {
    expect(Elections.foreignKey()).toBe('election_id');
  });
});
