const AssociatedItem = require('../item');

describe('getValuesLinks()', () => {
  test('returns the expected values', () => {
    expect(AssociatedItem.getValuesLinks('entities', 1)).toEqual({
      options: null,
      total: {
        label: '1 entity',
      },
    });
    expect(AssociatedItem.getValuesLinks('entities', 2)).toEqual({
      options: null,
      total: {
        label: '2 entities',
      },
    });
    expect(AssociatedItem.getValuesLinks('entities', 5)).toEqual({
      options: null,
      total: {
        label: '5 entities',
      },
    });
    expect(AssociatedItem.getValuesLinks('entities', 6)).toEqual({
      options: [
        {
          label: 'Top 5',
          params: {
            limit: 5,
          },
        },
        {
          label: 'View all',
          params: {
            limit: 6,
          },
        },
      ],
      total: {
        label: '6 entities',
      },
    });
    expect(AssociatedItem.getValuesLinks('entities', 11)).toEqual({
      options: [
        {
          label: 'Top 5',
          params: {
            limit: 5,
          },
        },
        {
          label: 'Top 10',
          params: {
            limit: 10,
          },
        },
        {
          label: 'View all',
          params: {
            limit: 11,
          },
        },
      ],
      total: {
        label: '11 entities',
      },
    });
  });
});
