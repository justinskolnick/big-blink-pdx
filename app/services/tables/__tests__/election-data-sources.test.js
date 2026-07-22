const ElectionDataSources = require('../election-data-sources');

describe('className()', () => {
  test('returns the expected field', () => {
    expect(ElectionDataSources.className()).toBe('ElectionDataSources');
  });
});

describe('tableName()', () => {
  test('returns the expected tableName', () => {
    expect(ElectionDataSources.tableName()).toBe('election_data_sources');
  });
});

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(ElectionDataSources.fields()).toEqual([
      'election_data_sources.id',
      'election_data_sources.election_id',
      'election_data_sources.data_source_id',
    ]);
  });
});

describe('primaryKey()', () => {
  test('returns the expected field', () => {
    expect(ElectionDataSources.primaryKey()).toBe('election_data_sources.id');
  });
});

describe('foreignKey()', () => {
  test('returns the expected field', () => {
    expect(ElectionDataSources.foreignKey()).toBe('election_data_source_id');
  });
});
