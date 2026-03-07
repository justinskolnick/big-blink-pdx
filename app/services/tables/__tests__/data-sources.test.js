const DataSources = require('../data-sources');

describe('className()', () => {
  test('returns the expected field', () => {
    expect(DataSources.className()).toBe('DataSources');
  });
});

describe('tableName()', () => {
  test('returns the expected tableName', () => {
    expect(DataSources.tableName()).toBe('data_sources');
  });
});

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(DataSources.fields()).toEqual([
      'data_sources.id',
      'data_sources.type',
      'data_sources.format',
      'data_sources.title',
      'data_sources.year',
      'data_sources.quarter',
      'data_sources.public_url',
      'data_sources.is_via_public_records',
      'data_sources.retrieved_at',
    ]);
  });
});

describe('primaryKey()', () => {
  test('returns the expected field', () => {
    expect(DataSources.primaryKey()).toBe('data_sources.id');
  });
});

describe('foreignKey()', () => {
  test('returns the expected field', () => {
    expect(DataSources.foreignKey()).toBe('data_source_id');
  });
});
