const ElectiveOfficeTerms = require('../elective-office-terms');

describe('className()', () => {
  test('returns the expected field', () => {
    expect(ElectiveOfficeTerms.className()).toBe('ElectiveOfficeTerms');
  });
});

describe('tableName()', () => {
  test('returns the expected tableName', () => {
    expect(ElectiveOfficeTerms.tableName()).toBe('elective_office_terms');
  });
});

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(ElectiveOfficeTerms.fields()).toEqual([
      'elective_office_terms.id',
      'elective_office_terms.duration_years',
      'elective_office_terms.date_start',
      'elective_office_terms.date_end',
    ]);
  });
});

describe('primaryKey()', () => {
  test('returns the expected field', () => {
    expect(ElectiveOfficeTerms.primaryKey()).toBe('elective_office_terms.id');
  });
});

describe('foreignKey()', () => {
  test('returns the expected field', () => {
    expect(ElectiveOfficeTerms.foreignKey()).toBe('elective_office_term_id');
  });
});
