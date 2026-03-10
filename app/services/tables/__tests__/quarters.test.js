const Quarters = require('../quarters');

describe('className()', () => {
  test('returns the expected field', () => {
    expect(Quarters.className()).toBe('Quarters');
  });
});

describe('tableName()', () => {
  test('returns the expected tableName', () => {
    expect(Quarters.tableName()).toBe('quarters');
  });
});

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(Quarters.fields()).toEqual([
      'quarters.id',
      'quarters.year',
      'quarters.quarter',
      'quarters.slug',
      'quarters.date_start',
      'quarters.date_end',
    ]);
  });
});

describe('primaryKey()', () => {
  test('returns the expected field', () => {
    expect(Quarters.primaryKey()).toBe('quarters.id');
  });
});

describe('foreignKey()', () => {
  test('returns the expected field', () => {
    expect(Quarters.foreignKey()).toBe('quarter_id');
  });
});
