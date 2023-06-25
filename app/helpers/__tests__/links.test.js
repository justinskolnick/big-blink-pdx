const {
  links,
  getPagination,
} = require('../links');

describe('links', () => {
  test('has expected links', () => {
    expect(links.home()).toBe('/');
    expect(links.entities()).toBe('/entities');
    expect(links.entity(1)).toBe('/entities/1');
    expect(links.incidents()).toBe('/incidents');
    expect(links.incident(1)).toBe('/incidents/1');
    expect(links.people()).toBe('/people');
    expect(links.person(1)).toBe('/people/1');
    expect(links.sources()).toBe('/sources');
    expect(links.source(1)).toBe('/sources/1');
  });
});

describe('getPagination()', () => {
  const config = {
    total: 9,
    perPage: 10,
    page: 1,
    params: {},
    path: links.people(),
  };

  test('with one page', () => {
    expect(getPagination(config)).toEqual({
      page: 1,
      pageCount: 1,
      pages: {
        last: {
          label: 1,
          link: {
            pathname: '/people',
            search: '',
          },
          value: 1,
        },
        next: null,
        numbered: [
          {
            label: 1,
            link: {
              pathname: '/people',
              search: '',
            },
            value: 1,
          },
        ],
        previous: null,
      },
      total: 9,
    });
  });

  test('with two pages', () => {
    config.total = 19;
    config.page = 2;

    expect(getPagination(config)).toEqual({
      page: 2,
      pageCount: 2,
      pages: {
        last: {
          label: 2,
          link: {
            pathname: '/people',
            search: 'page=2',
          },
          value: 2,
        },
        next: null,
        numbered: [
          {
            label: 1,
            link: {
              pathname: '/people',
              search: '',
            },
            value: 1,
          },
          {
            label: 2,
            link: {
              pathname: '/people',
              search: 'page=2',
            },
            value: 2,
          },
        ],
        previous: {
          label: 1,
          link: {
            pathname: '/people',
            search: '',
          },
          value: 1,
        },
      },
      total: 19,
    });
  });

  test('with more than ten pages', () => {
    config.total = 119;
    config.page = 11;

    expect(getPagination(config)).toEqual({
      page: 11,
      pageCount: 12,
      pages: {
        last: {
          label: 12,
          link: {
            pathname: '/people',
            search: 'page=12',
          },
          value: 12,
        },
        next: {
          label: 12,
          link: {
            pathname: '/people',
            search: 'page=12',
          },
          value: 12,
        },
        numbered: [
          {
            label: 1,
            link: {
              pathname: '/people',
              search: '',
            },
            value: 1,
          },
          null,
          {
            label: 3,
            link: {
              pathname: '/people',
              search: 'page=3',
            },
            value: 3,
          },
          {
            label: 4,
            link: {
              pathname: '/people',
              search: 'page=4',
            },
            value: 4,
          },
          {
            label: 5,
            link: {
              pathname: '/people',
              search: 'page=5',
            },
            value: 5,
          },
          {
            label: 6,
            link: {
              pathname: '/people',
              search: 'page=6',
            },
            value: 6,
          },
          {
            label: 7,
            link: {
              pathname: '/people',
              search: 'page=7',
            },
            value: 7,
          },
          {
            label: 8,
            link: {
              pathname: '/people',
              search: 'page=8',
            },
            value: 8,
          },
          {
            label: 9,
            link: {
              pathname: '/people',
              search: 'page=9',
            },
            value: 9,
          },
          {
            label: 10,
            link: {
              pathname: '/people',
              search: 'page=10',
            },
            value: 10,
          },
          {
            label: 11,
            link: {
              pathname: '/people',
              search: 'page=11',
            },
            value: 11,
          },
          {
            label: 12,
            link: {
              pathname: '/people',
              search: 'page=12',
            },
            value: 12,
          },
        ],
        previous: {
          label: 10,
          link: {
            pathname: '/people',
            search: 'page=10',
          },
          value: 10,
        },
      },
      total: 119,
    });
  });
});
