const {
  getFilters,
} = require('../list');

describe('getFilters()', () => {
  let options;

  beforeAll(() => {
    options = {
      search: {
        id: 'items-search',
      },
    };
  });

  describe('with default options', () => {
    test('should return the expected values', () => {
      const queryParams = new URLSearchParams();

      expect(getFilters(queryParams, options)).toEqual({
        search: {
          fields: {
            'search-input': [
              {
                type: 'text',
                value: 'Show results matching',
              },
              {
                name: 'search',
                type: 'input-search',
              },
            ],
          },
          id: 'items-search',
          labels: [
            {
              type: 'text',
              value: 'Filter this list by',
            },
            {
              action: 'search-input',
              to: null,
              type: 'link',
              value: 'search term',
            },
          ],
          model: null,
        },
      });
    });
  });
});
