const {
  getDetailDescription,
  getIndexDescription,
  getMeta,
  getPageTitle,
} = require('../meta');

describe('getDetailDescription()', () => {
  test('with default options', () => {
    expect(getDetailDescription()).toBe('Activity according to lobbying data published by the City of Portland, Oregon');
  });

  describe('with a name', () => {
    test('with involving', () => {
      expect(getDetailDescription('John Doe')).toBe('Activity involving John Doe according to lobbying data published by the City of Portland, Oregon');
    });

    test('with another word', () => {
      expect(getDetailDescription('John Doe', 'from')).toBe('Activity from John Doe according to lobbying data published by the City of Portland, Oregon');
    });
  });

  test('without a name', () => {
    expect(getDetailDescription()).toBe('Activity according to lobbying data published by the City of Portland, Oregon');
  });
});

describe('getIndexDescription()', () => {
  test('with a type', () => {
    expect(getIndexDescription('people')).toBe('A list of people involved in lobbying activity according to data published by the City of Portland, Oregon');
  });

  test('without a type', () => {
    expect(getIndexDescription()).toBe('Lobbying activity according to data published by the City of Portland, Oregon');
  });
});

describe('getMeta()', () => {
  const res = {
    flash: {
      errors: [],
      warnings: [
        {
          customMessage: 'Uh oh',
          status: 400,
        },
      ],
    },
  };

  describe('with a section', () => {
    let section = null;

    beforeEach(() => {
      section = {
        slug: 'people',
        title: 'People',
      };
    });

    afterEach(() => {
      section = null;
    });

    describe('by default', () => {
      test('returns the expected object', () => {
        expect(getMeta(res, { section })).toEqual({
          errors: res.flash.errors,
          pageTitle: 'People',
          section: {
            links: {
              section: {
                label: 'People',
                path: '/people',
              },
            },
            slug: 'people',
            title: 'People',
          },
          warnings: res.flash.warnings,
        });
      });
    });

    describe('and an item', () => {
      beforeEach(() => {
        section = {
          id: 2062,
          slug: 'people',
          subtitle: 'George Jetson',
          title: 'People',
        };
      });

      afterEach(() => {
        section = null;
      });

      test('returns the expected object', () => {
        expect(getMeta(res, { section })).toEqual({
          errors: res.flash.errors,
          pageTitle: 'George Jetson · People',
          section: {
            id: 2062,
            links: {
              section: {
                label: 'People',
                path: '/people',
              },
              detail: {
                label: 'George Jetson',
                path: '/people/2062',
              },
            },
            slug: 'people',
            subtitle: 'George Jetson',
            title: 'People',
          },
          warnings: res.flash.warnings,
        });
      });
    });

    describe('and a page title', () => {
      test('returns the expected object', () => {
        expect(getMeta(res, { section, pageTitle: 'Okay whatever' })).toEqual({
          errors: res.flash.errors,
          pageTitle: 'Okay whatever',
          section: {
            links: {
              section: {
                label: 'People',
                path: '/people',
              },
            },
            slug: 'people',
            title: 'People',
          },
          warnings: res.flash.warnings,
        });
      });
    });
  });
});

describe('getPageTitle()', () => {
  test('with a subtitle', () => {
    const section = {
      slug: 'people',
      title: 'People',
      id: 2062,
      subtitle: 'George Jetson',
    };

    expect(getPageTitle(section)).toEqual('George Jetson · People');
  });

  test('without a subtitle', () => {
    const section = {
      slug: 'people',
      title: 'People',
      id: null,
      subtitle: null,
    };

    expect(getPageTitle(section)).toEqual('People');
  });
});
