const {
  getFilters,
  getInvalidValueMessage,
  getParams,
  getParamsFromFilters,
  getQuarterSlug,
  getSort,
  getSortBy,
  hasDate,
  hasQuarterAndYear,
  hasSort,
  hasSortBy,
} = require('../param');

describe('getInvalidValueMessage()', () => {
  test('with a param value', () => {
    expect(getInvalidValueMessage('name', 123)).toEqual('<strong>123</strong> is not a valid value for <code>name</code>');
  });
});

describe('getFilters()', () => {
  describe('with a date', () => {
    test('should include the date', () => {
      const queryParams = new URLSearchParams('date_on=2015-11-12&sort=ASC&with_entity_id=123&with_person_id=321');

      expect(getFilters(queryParams)).toEqual({
        date_on: { // eslint-disable-line camelcase
          key: 'date_on',
          label: 'November 12, 2015',
          value: '2015-11-12',
        },
        dates: {
          labels: [
            {
              type: 'text',
              value: 'on',
            },
            {
              type: 'label',
              value: 'November 12, 2015',
            },
          ],
          values: {
            date_on: '2015-11-12', // eslint-disable-line camelcase
          }
        },
        entities: {
          labels: [
            {
              type: 'text',
              value: 'and',
            },
            {
              type: 'id',
              value: 123,
            },
          ],
          model: 'entities',
          values: {
            with_entity_id: 123, // eslint-disable-line camelcase
          },
        },
        people: {
          labels: [
            {
              type: 'text',
              value: 'and',
            },
            {
              type: 'id',
              value: 321,
            },
          ],
          model: 'people',
          values: {
            with_person_id: 321, // eslint-disable-line camelcase
          },
        },
        sort: 'ASC',
        with_entity_id: { // eslint-disable-line camelcase
          key: 'with_entity_id',
          label: 123,
          value: 123,
        },
        with_person_id: { // eslint-disable-line camelcase
          key: 'with_person_id',
          label: 321,
          value: 321,
        },
      });
    });
  });

  describe('with a date range', () => {
    test('should include the date range', () => {
      const queryParams = new URLSearchParams('date_range_from=2015-11-12&date_range_to=2015-12-13&sort=ASC&with_entity_id=123&with_person_id=321');

      expect(getFilters(queryParams)).toEqual({
        date_range_from: { // eslint-disable-line camelcase
          key: 'date_range_from',
          label: 'November 12, 2015',
          value: '2015-11-12',
        },
        date_range_to: { // eslint-disable-line camelcase
          key: 'date_range_to',
          label: 'December 13, 2015',
          value: '2015-12-13',
        },
        dates: {
          labels: [
            {
              type: 'text',
              value: 'between',
            },
            {
              type: 'label',
              value: 'November 12, 2015',
            },
            {
              type: 'text',
              value: 'and',
            },
            {
              type: 'label',
              value: 'December 13, 2015',
            },
          ],
          values: {
            date_range_from: '2015-11-12', // eslint-disable-line camelcase
            date_range_to: '2015-12-13', // eslint-disable-line camelcase
          },
        },
        entities: {
          labels: [
            {
              type: 'text',
              value: 'and',
            },
            {
              type: 'id',
              value: 123,
            },
          ],
          model: 'entities',
          values: {
            with_entity_id: 123, // eslint-disable-line camelcase
          },
        },
        people: {
          labels: [
            {
              type: 'text',
              value: 'and',
            },
            {
              type: 'id',
              value: 321,
            },
          ],
          model: 'people',
          values: {
            with_person_id: 321, // eslint-disable-line camelcase
          },
        },
        sort: 'ASC',
        with_entity_id: { // eslint-disable-line camelcase
          key: 'with_entity_id',
          label: 123,
          value: 123,
        },
        with_person_id: { // eslint-disable-line camelcase
          key: 'with_person_id',
          label: 321,
          value: 321,
        },
      });
    });
  });

  describe('with am incomplete date range', () => {
    test('should ignore the date range', () => {
      const queryParams = new URLSearchParams('date_range_from=2015-11-12&sort=ASC&with_entity_id=123&with_person_id=321');

      expect(getFilters(queryParams)).toEqual({
        sort: 'ASC',
        dates: {
          labels: [
            {
              to: 'date-select',
              value: 'on a date',
              type: 'link',
            },
            {
              value: 'or',
              type: 'text',
            },
            {
              to: 'date-range-select',
              value: 'between dates',
              type: 'link',
            },
          ],
        },
        entities: {
          labels: [
            {
              type: 'text',
              value: 'and',
            },
            {
              type: 'id',
              value: 123,
            },
          ],
          model: 'entities',
          values: {
            with_entity_id: 123, // eslint-disable-line camelcase
          },
        },
        people: {
          labels: [
            {
              type: 'text',
              value: 'and',
            },
            {
              type: 'id',
              value: 321,
            },
          ],
          model: 'people',
          values: {
            with_person_id: 321, // eslint-disable-line camelcase
          },
        },
        with_entity_id: { // eslint-disable-line camelcase
          key: 'with_entity_id',
          label: 123,
          value: 123,
        },
        with_person_id: { // eslint-disable-line camelcase
          key: 'with_person_id',
          label: 321,
          value: 321,
        },
      });
    });
  });
});

describe('getParams()', () => {
  describe('with a date', () => {
    test('should include the date', () => {
      const queryParams = new URLSearchParams('date_on=2015-11-12&sort=ASC&with_entity_id=123&with_person_id=321');

      expect(getParams(queryParams)).toEqual({
        date_on: '2015-11-12', // eslint-disable-line camelcase
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
    expect(getParamsFromFilters(filters)).toEqual({
      date_on: '2015-11-12', // eslint-disable-line camelcase
      sort: 'ASC',
      with_entity_id: 123, // eslint-disable-line camelcase
      with_person_id: 321, // eslint-disable-line camelcase
    });
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

describe('hasQuarterAndYear()', () => {
  test('with a param value', () => {
    expect(hasQuarterAndYear('Q4-2021')).toBe(true);
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
