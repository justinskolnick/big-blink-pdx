const AssociatedItem = require('../item');

describe('getValuesLinks()', () => {
  test('returns the expected values', () => {
    expect(AssociatedItem.getValuesLinks('entities', 1)).toEqual({
      intro: null,
      options: null,
      total: {
        label: '1 entity',
      },
    });
    expect(AssociatedItem.getValuesLinks('entities', 2)).toEqual({
      intro: null,
      options: null,
      total: {
        label: '2 entities',
      },
    });
    expect(AssociatedItem.getValuesLinks('entities', 5)).toEqual({
      intro: null,
      options: null,
      total: {
        label: '5 entities',
      },
    });
    expect(AssociatedItem.getValuesLinks('entities', 6)).toEqual({
      intro: {
        label: 'View',
      },
      options: [
        {
          label: '5',
          params: {
            limit: 5,
          },
        },
        {
          label: 'All',
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
      intro: {
        label: 'View',
      },
      options: [
        {
          label: '5',
          params: {
            limit: 5,
          },
        },
        {
          label: '10',
          params: {
            limit: 10,
          },
        },
        {
          label: 'All',
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
