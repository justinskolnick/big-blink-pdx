const {
  getFilters,
} = require('../leaderboard');

describe('getFilters()', () => {
  let options;

  beforeAll(() => {
    options = {
      quarter: {
        '2012-Q1': '2012-Q1',
        '2012-Q2': '2012-Q2',
      },
      year: {
        2012: '2012',
        2013: '2013'
      },
    };
  });

  describe('with default options', () => {
    test('should return the expected values', () => {
      const queryParams = new URLSearchParams();

      expect(getFilters(queryParams, options)).toEqual({
        period: {
          fields: {
            'quarter-select': [
              {
                type: 'text',
                value: 'Show activity during',
              },
              {
                name: 'quarter',
                options: options.quarter,
                type: 'select',
              },
            ],
            'year-select': [
              {
                type: 'text',
                value: 'Show activity during',
              },
              {
                name: 'year',
                options: options.year,
                type: 'select',
              },
            ],
          },
          labels: [
            {
              type: 'text',
              value: 'Show activity during',
            },
            {
              action: 'year-select',
              to: null,
              type: 'link',
              value: 'a year',
            },
            {
              type: 'text',
              value: 'or',
            },
            {
              action: 'quarter-select',
              to: null,
              type: 'link',
              value: 'a quarter',
            },
          ],
          model: null,
        },
      });
    });
  });

  describe('with a quarter', () => {
    test('should return the expected values', () => {
      const queryParams = new URLSearchParams('quarter=Q2-2014');

      expect(getFilters(queryParams, options)).toEqual({
        period: {
          fields: null,
          labels: [
            {
              type: 'text',
              value: 'Showing activity during',
            },
            {
              type: 'label',
              value: 'Q2',
            },
            {
              type: 'text',
              value: 'of',
            },
            {
              type: 'label',
              value: 2014,
            },
          ],
          model: null,
          values: {
            quarter: 'Q2-2014',
          },
        },
      });
    });
  });

  describe('with a year', () => {
    test('should return the expected values', () => {
      const queryParams = new URLSearchParams('year=2014');

      expect(getFilters(queryParams, options)).toEqual({
        period: {
          fields: null,
          labels: [
            {
              type: 'text',
              value: 'Showing activity during',
            },
            {
              type: 'label',
              value: '2014',
            },
          ],
          model: null,
          values: {
            year: '2014',
          },
        },
      });
    });
  });
});
