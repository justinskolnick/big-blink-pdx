const AssociatedItem = require('../item');

describe('getLinks()', () => {
  let associatedItem = null;

  beforeEach(() => {
    associatedItem = new AssociatedItem();
  });

  afterEach(() => {
    associatedItem = null;
  });

  test('returns the expected values', () => {
    expect(associatedItem.getLinks('entities', 1)).toEqual({
      intro: null,
      options: null,
      total: {
        label: '1 entity',
      },
    });
    expect(associatedItem.getLinks('entities', 2)).toEqual({
      intro: null,
      options: null,
      total: {
        label: '2 entities',
      },
    });
    expect(associatedItem.getLinks('entities', 5)).toEqual({
      intro: null,
      options: null,
      total: {
        label: '5 entities',
      },
    });
    expect(associatedItem.getLinks('entities', 6)).toEqual({
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
    expect(associatedItem.getLinks('entities', 11)).toEqual({
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
