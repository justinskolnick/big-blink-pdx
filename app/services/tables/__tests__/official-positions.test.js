const OfficialPositions = require('../official-positions');

describe('className()', () => {
  test('returns the expected field', () => {
    expect(OfficialPositions.className()).toBe('OfficialPositions');
  });
});

describe('tableName()', () => {
  test('returns the expected tableName', () => {
    expect(OfficialPositions.tableName()).toBe('official_positions');
  });
});

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(OfficialPositions.fields()).toEqual([
      'official_positions.pernr',
      'official_positions.name',
      'official_positions.date_start',
      'official_positions.date_end',
      'official_positions.date_final',
      'official_positions.is_withdrawn',
      'official_positions.is_elected',
      'official_positions.office',
      'official_positions.position',
      'official_positions.district',
      'official_positions.responsible_to_pernr',
      'official_positions.area',
      'official_positions.assignment',
      'official_positions.classification',
      'official_positions.rank',
      'official_positions.is_chief',
      'official_positions.role',
    ]);
  });
});

describe('primaryKey()', () => {
  test('returns the expected field', () => {
    expect(OfficialPositions.primaryKey()).toBe('official_positions.id');
  });
});

describe('foreignKey()', () => {
  test('returns the expected field', () => {
    expect(OfficialPositions.foreignKey()).toBe('official_position_id');
  });
});
