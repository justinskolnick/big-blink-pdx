const ElectiveOffices = require('../elective-offices');

describe('className()', () => {
  test('returns the expected field', () => {
    expect(ElectiveOffices.className()).toBe('ElectiveOffices');
  });
});

describe('tableName()', () => {
  test('returns the expected tableName', () => {
    expect(ElectiveOffices.tableName()).toBe('elective_offices');
  });
});

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(ElectiveOffices.fields()).toEqual([
      'elective_offices.id',
      'elective_offices.office',
      'elective_offices.district',
      'elective_offices.position',
    ]);
  });
});

describe('primaryKey()', () => {
  test('returns the expected field', () => {
    expect(ElectiveOffices.primaryKey()).toBe('elective_offices.id');
  });
});

describe('foreignKey()', () => {
  test('returns the expected field', () => {
    expect(ElectiveOffices.foreignKey()).toBe('elective_office_id');
  });
});
