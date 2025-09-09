const { getFilters } = require('../filter');

describe('getFilters()', () => {
  describe('with a date', () => {
    test('should include the date', () => {
      const queryParams = new URLSearchParams('date_on=2015-11-12&role=official&sort=ASC&with_entity_id=123&with_person_id=321');

      expect(getFilters(queryParams)).toEqual({
        dates: {
          fields: null,
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
          model: null,
          values: {
            date_on: '2015-11-12', // eslint-disable-line camelcase
          }
        },
        entities: {
          fields: null,
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
          fields: null,
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
        quarter: undefined,
        role: {
          fields: null,
          labels: [
            {
              type: 'text',
              value: 'as an',
            },
            {
              type: 'label',
              value: 'official',
            },
          ],
          model: null,
          values: {
            role: 'official',
          },
        },
      });
    });
  });

  describe('with a date range', () => {
    test('should include the date range', () => {
      const queryParams = new URLSearchParams('date_range_from=2015-11-12&date_range_to=2015-12-13&sort=ASC&with_entity_id=123&with_person_id=321');

      expect(getFilters(queryParams)).toEqual({
        dates: {
          fields: null,
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
          model: null,
          values: {
            date_range_from: '2015-11-12', // eslint-disable-line camelcase
            date_range_to: '2015-12-13', // eslint-disable-line camelcase
          },
        },
        entities: {
          fields: null,
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
          fields: null,
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
        quarter: undefined,
      });
    });
  });

  describe('with an incomplete date range', () => {
    test('should ignore the date range', () => {
      const queryParams = new URLSearchParams('date_range_from=2015-11-12&sort=ASC&with_entity_id=123&with_person_id=321');

      expect(getFilters(queryParams)).toEqual({
        dates: {
          fields: {
            'date-range-select': [
              {
                type: 'text',
                value: 'between',
              },
              {
                name: 'date_range_from',
                type: 'input-date',
              },
              {
                type: 'text',
                value: 'and',
              },
              {
                name: 'date_range_to',
                type: 'input-date',
              },
            ],
            'date-select': [
              {
                type: 'text',
                value: 'on',
              },
              {
                name: 'date_on',
                type: 'input-date',
              },
            ],
          },
          labels: [
            {
              action: 'date-select',
              to: null,
              type: 'link',
              value: 'on a date',
            },
            {
              type: 'text',
              value: 'or',
            },
            {
              action: 'date-range-select',
              to: null,
              type: 'link',
              value: 'between dates',
            },
          ],
          model: null,
        },
        entities: {
          fields: null,
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
          fields: null,
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
        quarter: undefined,
      });
    });
  });

  describe('with a roled id', () => {
    test('should include the roled id', () => {
      const queryParams = new URLSearchParams('people=123:official,321:lobbyist,456');

      expect(getFilters(queryParams)).toEqual({
        dates: {
          fields: {
            'date-range-select': [
              {
                type: 'text',
                value: 'between',
              },
              {
                name: 'date_range_from',
                type: 'input-date',
              },
              {
                type: 'text',
                value: 'and',
              },
              {
                name: 'date_range_to',
                type: 'input-date',
              },
            ],
            'date-select': [
              {
                type: 'text',
                value: 'on',
              },
              {
                name: 'date_on',
                type: 'input-date',
              },
            ],
          },
          labels: [
            {
              action: 'date-select',
              to: null,
              type: 'link',
              value: 'on a date',
            },
            {
              type: 'text',
              value: 'or',
            },
            {
              action: 'date-range-select',
              to: null,
              type: 'link',
              value: 'between dates',
            },
          ],
          model: null,
        },
        entities: undefined,
        people: [
          {
            fields: null,
            labels: [
              {
                type: 'text',
                value: 'and',
              },
              {
                type: 'id',
                value: 123,
              },
              {
                type: 'text',
                value: 'as an',
              },
              {
                type: 'label',
                value: 'official',
              },
            ],
            model: 'people',
            values: {
              people: [
                '123:official',
              ],
            },
          },
          {
            fields: null,
            labels: [
              {
                type: 'text',
                value: 'and',
              },
              {
                type: 'id',
                value: 321,
              },
              {
                type: 'text',
                value: 'as a',
              },
              {
                type: 'label',
                value: 'lobbyist',
              },
            ],
            model: 'people',
            values: {
              people: [
                '321:lobbyist',
              ],
            },
          },
          {
            fields: null,
            labels: [
              {
                type: 'text',
                value: 'and',
              },
              {
                type: 'id',
                value: 456,
              },
            ],
            model: 'people',
            values: {
              people: [
                '456',
              ],
            },
          },
        ],
        quarter: undefined,
        role: undefined,
      });
    });
  });

  describe('with a quarter', () => {
    test('should include the quarter', () => {
      const queryParams = new URLSearchParams('sort=ASC&with_entity_id=123&quarter=Q2-2014');

      expect(getFilters(queryParams)).toEqual({
        dates: {
          fields: {
            'date-range-select': [
              {
                type: 'text',
                value: 'between',
              },
              {
                name: 'date_range_from',
                type: 'input-date',
              },
              {
                type: 'text',
                value: 'and',
              },
              {
                name: 'date_range_to',
                type: 'input-date',
              },
            ],
            'date-select': [
              {
                type: 'text',
                value: 'on',
              },
              {
                name: 'date_on',
                type: 'input-date',
              },
            ],
          },
          labels: [
            {
              action: 'date-select',
              to: null,
              type: 'link',
              value: 'on a date',
            },
            {
              type: 'text',
              value: 'or',
            },
            {
              action: 'date-range-select',
              to: null,
              type: 'link',
              value: 'between dates',
            },
          ],
          model: null,
        },
        entities: {
          fields: null,
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
        people: undefined,
        quarter: {
          fields: null,
          labels: [
            {
              type: 'text',
              value: 'during',
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
});
