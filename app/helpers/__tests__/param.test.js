const { getFilters } = require('../filter');
const {
  getInvalidValueMessage,
  getOutOfRangeValueMessage,
  getParams,
  getParamsFromFilters,
  getPeople,
  getQuarterAndYear,
  getQuarterSlug,
  getSort,
  getSortBy,
  hasDate,
  hasPeople,
  hasQuarter,
  hasQuarterAndYearDeprecated,
  hasRole,
  hasSort,
  hasSortBy,
  hasYear,
  hasYearAndQuarter,
  migrateQuarterSlug,
} = require('../param');

describe('getInvalidValueMessage()', () => {
  test('with a param value', () => {
    expect(getInvalidValueMessage('name', 123)).toEqual('<strong>123</strong> is not a valid value for <code>name</code>');
  });
});

describe('getOutOfRangeValueMessage()', () => {
  test('with a param value', () => {
    expect(getOutOfRangeValueMessage('name', 123)).toEqual('<strong>123</strong> is out of range for <code>name</code>');
  });
});

describe('getParams()', () => {
  describe('with a date', () => {
    test('should include the date', () => {
      const queryParams = new URLSearchParams('date_on=2015-11-12&role=lobbyist&sort=ASC&with_entity_id=123&with_person_id=321');

      expect(getParams(queryParams)).toEqual({
        date_on: '2015-11-12', // eslint-disable-line camelcase
        role: 'lobbyist',
        sort: 'ASC',
        with_entity_id: 123, // eslint-disable-line camelcase
        with_person_id: 321, // eslint-disable-line camelcase
      });
    });
  });

  describe('with a date range', () => {
    test('should include the date', () => {
      const queryParams = new URLSearchParams('date_range_from=2015-11-12&date_range_to=2015-12-13&sort=ASC&with_entity_id=123&with_person_id=321');

      expect(getParams(queryParams)).toEqual({
        date_range_from: '2015-11-12', // eslint-disable-line camelcase
        date_range_to: '2015-12-13', // eslint-disable-line camelcase
        sort: 'ASC',
        with_entity_id: 123, // eslint-disable-line camelcase
        with_person_id: 321, // eslint-disable-line camelcase
      });
    });
  });

  describe('with an incomplete date range', () => {
    test('should ignore the date range', () => {
      const queryParams = new URLSearchParams('date_range_from=2015-11-12&sort=ASC&with_entity_id=123&with_person_id=321');

      expect(getParams(queryParams)).toEqual({
        sort: 'ASC',
        with_entity_id: 123, // eslint-disable-line camelcase
        with_person_id: 321, // eslint-disable-line camelcase
      });
    });
  });
});

describe('getParamsFromFilters()', () => {
  const queryParams = new URLSearchParams('date_on=2015-11-12&sort=ASC&with_entity_id=123&with_person_id=321');
  const filters = getFilters(queryParams);

  test('with param values', () => {
    expect(getParamsFromFilters(queryParams, filters)).toEqual({
      date_on: '2015-11-12', // eslint-disable-line camelcase
      sort: 'ASC',
      with_entity_id: 123, // eslint-disable-line camelcase
      with_person_id: 321, // eslint-disable-line camelcase
    });
  });

  describe('with a roled id', () => {
    const queryParams = new URLSearchParams('people=123:official,321:lobbyist,456');
    const filters = getFilters(queryParams);

    test('with param values', () => {
      expect(getParamsFromFilters(queryParams, filters)).toEqual({
        people: [
          '123:official',
          '321:lobbyist',
          '456',
        ],
      });
    });
  });
});

describe('getPeople()', () => {
  test('with param values', () => {
    expect(getPeople('123')).toEqual([{ id: 123 }]);
    expect(getPeople('321')).toEqual([{ id: 321 }]);
    expect(getPeople('321,123')).toEqual([{ id: 321 }, { id: 123 }]);
    expect(getPeople('123:lobbyist')).toEqual([{ id: 123, role: 'lobbyist' }]);
    expect(getPeople('321:official')).toEqual([{ id: 321, role: 'official' }]);
    expect(getPeople('321:officially')).toEqual([{ id: 321 }]);
  });
});

describe('getQuarterAndYear()', () => {
  test('with param values', () => {
    expect(getQuarterAndYear('2021-Q4', true)).toEqual({ quarter: 4, year: 2021 });
    expect(getQuarterAndYear('Q4-2021', true)).toEqual({ quarter: 4, year: 2021 });
  });
});

describe('getQuarterSlug()', () => {
  test('with a param value', () => {
    expect(getQuarterSlug('Q4-2021')).toEqual('2021-q4');
    expect(getQuarterSlug('2021-Q4')).toEqual('2021-q4');
  });
});

describe('getSort()', () => {
  test('with a param value', () => {
    expect(getSort('ASC')).toEqual('ASC');
    expect(getSort('DESC')).toEqual('DESC');
    expect(getSort('RISC')).toBeNull();
  });
});

describe('getSortBy()', () => {
  test('with a param value', () => {
    expect(getSortBy('name')).toEqual('name');
    expect(getSortBy('total')).toEqual('total');
    expect(getSortBy('id')).toBeNull();
  });
});

describe('hasDate()', () => {
  test('with a param value', () => {
    expect(hasDate('2004-01-07')).toBe(false);
    expect(hasDate('2014-01-07')).toBe(true);
    expect(hasDate('2024-12-31')).toBe(true);
    expect(hasDate('2034-12-31')).toBe(false);

    expect(hasDate('2024-12-3')).toBe(false);
    expect(hasDate('2024-12-')).toBe(false);
    expect(hasDate('2024-12')).toBe(false);
    expect(hasDate('2024-1')).toBe(false);
    expect(hasDate('2024-')).toBe(false);
    expect(hasDate('2024')).toBe(false);
    expect(hasDate('2021-Q4')).toBe(false);
  });
});

describe('hasPeople()', () => {
  test('with a param value', () => {
    expect(hasPeople(null)).toBe(false);
    expect(hasPeople('123')).toBe(true);
    expect(hasPeople('321')).toBe(true);
    expect(hasPeople('123,321')).toBe(true);
    expect(hasPeople('123:lobbyist')).toBe(true);
    expect(hasPeople('321:official')).toBe(true);
    expect(hasPeople('123:lobbyist,321')).toBe(true);
    expect(hasPeople('123:lobbyist,321:official')).toBe(true);
    expect(hasPeople('123:lobbyist,')).toBe(true);
  });
});

describe('hasQuarter()', () => {
  test('with a param value', () => {
    expect(hasQuarter(null)).toBe(false);
    expect(hasQuarter('Q4-2021')).toBe(true);
    expect(hasQuarter('Q42021')).toBe(false);
    expect(hasQuarter('2021-Q4')).toBe(true);
  });
});

describe('hasQuarterAndYearDeprecated()', () => {
  test('with a param value', () => {
    expect(hasQuarterAndYearDeprecated(null)).toBe(false);
    expect(hasQuarterAndYearDeprecated('Q4-2021')).toBe(true);
    expect(hasQuarterAndYearDeprecated('Q42021')).toBe(false);
    expect(hasQuarterAndYearDeprecated('2021-Q4')).toBe(false);
  });
});

describe('hasRole()', () => {
  test('with a param value', () => {
    expect(hasRole(null)).toBe(false);
    expect(hasRole('official')).toBe(true);
    expect(hasRole('officila')).toBe(false);
    expect(hasRole('lobbyist')).toBe(true);
    expect(hasRole('lobbying')).toBe(false);
  });
});

describe('hasSort()', () => {
  test('with a param value', () => {
    expect(hasSort('ASC')).toBe(true);
    expect(hasSort('DESC')).toBe(true);
    expect(hasSort('RISC')).toBe(false);
  });
});

describe('hasSortBy()', () => {
  test('with a param value', () => {
    expect(hasSortBy('name')).toBe(true);
    expect(hasSortBy('total')).toBe(true);
    expect(hasSortBy('id')).toBe(false);
  });
});

describe('hasYear()', () => {
  test('with a param value', () => {
    expect(hasYear('2013')).toBe(true);
    expect(hasYear('2021')).toBe(true);
    expect(hasYear('202')).toBe(false);
    expect(hasYear('20')).toBe(false);
    expect(hasYear('20201')).toBe(false);
  });
});

describe('hasYearAndQuarter()', () => {
  test('with a param value', () => {
    expect(hasYearAndQuarter(null)).toBe(false);
    expect(hasYearAndQuarter('Q4-2021')).toBe(false);
    expect(hasYearAndQuarter('Q42021')).toBe(false);
    expect(hasYearAndQuarter('2021-Q4')).toBe(true);
  });
});

describe('migrateQuarterSlug()', () => {
  test('with a param value', () => {
    expect(migrateQuarterSlug(null)).toBe(null);
    expect(migrateQuarterSlug('Q42021')).toBe(null);
    expect(migrateQuarterSlug('q4-2021')).toBe('2021-q4');
    expect(migrateQuarterSlug('Q4-2021')).toBe('2021-q4');
    expect(migrateQuarterSlug('2021-q4')).toBe('2021-q4');
    expect(migrateQuarterSlug('2021-Q4')).toBe('2021-q4');
  });
});

