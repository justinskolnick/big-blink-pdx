const Entities = require('../entities');

describe('className()', () => {
  test('returns the expected field', () => {
    expect(Entities.className()).toBe('Entities');
  });
});

describe('tableName()', () => {
  test('returns the expected tableName', () => {
    expect(Entities.tableName()).toBe('entities');
  });
});

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(Entities.fields()).toEqual([
      'entities.id',
      'entities.name',
      'entities.domain',
    ]);
  });
});

describe('primaryKey()', () => {
  test('returns the expected field', () => {
    expect(Entities.primaryKey()).toBe('entities.id');
  });
});

describe('foreignKey()', () => {
  test('returns the expected field', () => {
    expect(Entities.foreignKey()).toBe('entity_id');
  });
});
