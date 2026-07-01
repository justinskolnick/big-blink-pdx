const CityOfficeTerms = require('../city-office-terms');

describe('className()', () => {
  test('returns the expected field', () => {
    expect(CityOfficeTerms.className()).toBe('CityOfficeTerms');
  });
});

describe('tableName()', () => {
  test('returns the expected tableName', () => {
    expect(CityOfficeTerms.tableName()).toBe('city_office_terms');
  });
});

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(CityOfficeTerms.fields()).toEqual([
      'city_office_terms.id',
      'city_office_terms.duration_years',
      'city_office_terms.date_start',
      'city_office_terms.date_end',
    ]);
  });
});

describe('primaryKey()', () => {
  test('returns the expected field', () => {
    expect(CityOfficeTerms.primaryKey()).toBe('city_office_terms.id');
  });
});

describe('foreignKey()', () => {
  test('returns the expected field', () => {
    expect(CityOfficeTerms.foreignKey()).toBe('city_office_term_id');
  });
});
