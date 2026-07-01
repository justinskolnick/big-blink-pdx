const CityOffices = require('../city-offices');

describe('className()', () => {
  test('returns the expected field', () => {
    expect(CityOffices.className()).toBe('CityOffices');
  });
});

describe('tableName()', () => {
  test('returns the expected tableName', () => {
    expect(CityOffices.tableName()).toBe('city_offices');
  });
});

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(CityOffices.fields()).toEqual([
      'city_offices.id',
      'city_offices.office',
      'city_offices.district',
      'city_offices.position',
    ]);
  });
});

describe('primaryKey()', () => {
  test('returns the expected field', () => {
    expect(CityOffices.primaryKey()).toBe('city_offices.id');
  });
});

describe('foreignKey()', () => {
  test('returns the expected field', () => {
    expect(CityOffices.foreignKey()).toBe('city_office_id');
  });
});
