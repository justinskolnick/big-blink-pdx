const People = require('../people');

describe('className()', () => {
  test('returns the expected field', () => {
    expect(People.className()).toBe('People');
  });
});

describe('tableName()', () => {
  test('returns the expected tableName', () => {
    expect(People.tableName()).toBe('people');
  });
});

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(People.fields()).toEqual([
      'people.id',
      'people.identical_id',
      'people.pernr',
      'people.type',
      'people.name',
    ]);
  });
});

describe('primaryKey()', () => {
  test('returns the expected field', () => {
    expect(People.primaryKey()).toBe('people.id');
  });
});

describe('singular()', () => {
  test('returns the expected field', () => {
    expect(People.singular()).toBe('person');
  });
});

describe('plural()', () => {
  test('returns the expected field', () => {
    expect(People.plural()).toBe('people');
  });
});

describe('foreignKey()', () => {
  test('returns the expected field', () => {
    expect(People.foreignKey()).toBe('person_id');
  });
});
