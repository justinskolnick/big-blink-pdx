const Meta = require('../meta');

describe('toObject()', () => {
  const baseReq = {
    baseUrl: null,
    originalUrl: null,
    params: {},
    flash: {
      errors: [],
      warnings: [],
    },
  };

  let meta = null;
  let req = baseReq;

  afterEach(() => {
    req = baseReq;
    meta = null;
  });

  describe('when empty', () => {
    beforeEach(() => {
      meta = new Meta(req);
    });

    test('returns the expected object', () => {
      expect(meta.toObject()).toEqual({
        errors: [],
        pageTitle: undefined,
        section: {
          links: {
            section: {
              label: undefined,
              path: undefined,
            },
          },
          slug: undefined,
          title: undefined,
        },
        warnings: [],
      });
    });
  });

  describe('when home', () => {
    beforeEach(() => {
      req = {
        ...baseReq,
        baseUrl: '/home',
        originalUrl: '/home',
      };
      meta = new Meta(req);
    });

    test('returns the expected object', () => {
      expect(meta.toObject()).toEqual({
        errors: [],
        pageTitle: undefined,
        section: {
          links: {
            section: {
              label: undefined,
              path: undefined,
            },
          },
          slug: undefined,
          title: undefined,
        },
        warnings: [],
      });
    });
  });

  describe('with a section', () => {
    beforeEach(() => {
      req = {
        ...baseReq,
        baseUrl: '/people',
        originalUrl: '/people',
      };
      meta = new Meta(req);
    });

    test('returns the expected object', () => {
      expect(meta.toObject()).toEqual({
        errors: [],
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
        warnings: [],
      });
    });

    describe('and details', () => {
      beforeEach(() => {
        req = {
          ...baseReq,
          baseUrl: '/people',
          originalUrl: '/people/2062',
          params: {
            id: '2062',
          },
        };
        meta = new Meta(req, { name: 'George Jetson' });
      });

      test('returns the expected object', () => {
        expect(meta.toObject()).toEqual({
          errors: [],
          pageTitle: 'George Jetson · People',
          section: {
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
            title: 'People',
          },
          warnings: [],
        });
      });
    });

    describe('with an API route', () => {
      beforeEach(() => {
        req = {
          ...baseReq,
          baseUrl: '/api/people',
          originalUrl: '/api/people/2062',
          params: {
            id: '2062',
          },
        };
        meta = new Meta(req, { name: 'George Jetson' });
      });

      test('returns the expected object', () => {
        expect(meta.toObject()).toEqual({
          errors: [],
          pageTitle: 'George Jetson · People',
          section: {
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
            title: 'People',
          },
          warnings: [],
        });
      });
    });

    describe('with a non-primary API route', () => {
      beforeEach(() => {
        req = {
          ...baseReq,
          baseUrl: '/api/people',
          originalUrl: '/api/people/2062/incidents',
          params: {
            id: '2062',
          },
        };
        meta = new Meta(req, { name: 'George Jetson' });
      });

      test('returns the expected object', () => {
        expect(meta.toObject(false)).toEqual({
          errors: [],
          warnings: [],
        });
      });
    });

    describe('and errors', () => {
      let error = null;

      afterEach(() => {
        req = baseReq;
        meta = null;
        error = null;
      });

      describe('in the request', () => {
        beforeEach(() => {
          error = {
            customMessage: 'Something went wrong',
            message: 'Internal Server Error',
            status: 500,
          };
          req = {
            ...baseReq,
            baseUrl: '/people',
            originalUrl: '/people',
            flash: {
              ...baseReq.flash,
              errors: [error],
            },
          };
          meta = new Meta(req);
        });

        test('returns the expected object', () => {
          expect(meta.toObject()).toEqual({
            errors: [
              {
                customMessage: 'Something went wrong',
                message: 'Internal Server Error',
                status: 500,
              },
            ],
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
            warnings: [],
          });
        });
      });

      describe('via setErrors()', () => {
        beforeEach(() => {
          req = {
            ...baseReq,
            baseUrl: '/people',
            originalUrl: '/people',
          };
          meta = new Meta(req);

          error = {
            customMessage: 'Something went wrong',
            message: 'Internal Server Error',
            status: 500,
          };
          meta.setErrors([error]);
        });

        test('returns the expected object', () => {
          expect(meta.toObject()).toEqual({
            errors: [
              {
                customMessage: 'Something went wrong',
                message: 'Internal Server Error',
                status: 500,
              },
            ],
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
            warnings: [],
          });
        });
      });

      describe('via setError()', () => {
        beforeEach(() => {
          req = {
            ...baseReq,
            baseUrl: '/people',
            originalUrl: '/people',
          };
          meta = new Meta(req);

          error = {
            customMessage: 'Something went wrong',
            message: 'Internal Server Error',
            status: 500,
          };
          meta.setError(error);
        });

        test('returns the expected object', () => {
          expect(meta.toObject()).toEqual({
            errors: [
              {
                customMessage: 'Something went wrong',
                message: 'Internal Server Error',
                status: 500,
              },
            ],
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
            warnings: [],
          });
        });
      });
    });

    describe('and warnings', () => {
      let warning = null;

      afterEach(() => {
        req = baseReq;
        meta = null;
        warning = null;
      });

      describe('in the request', () => {
        beforeEach(() => {
          warning = {
            customMessage: '<strong>123</strong> is not a valid value for <code>name</code>.',
            status: 500,
          };
          req = {
            ...baseReq,
            baseUrl: '/people',
            originalUrl: '/people',
            flash: {
              ...baseReq.flash,
              warnings: [warning],
            },
          };
          meta = new Meta(req);
        });

        test('returns the expected object', () => {
          expect(meta.toObject()).toEqual({
            errors: [],
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
            warnings: [
              {
                customMessage: '<strong>123</strong> is not a valid value for <code>name</code>.',
                status: 500,
              },
            ],
          });
        });
      });

      describe('via setWarnings()', () => {
        beforeEach(() => {
          req = {
            ...baseReq,
            baseUrl: '/people',
            originalUrl: '/people',
          };
          meta = new Meta(req);

          warning = {
            customMessage: '<strong>123</strong> is not a valid value for <code>name</code>.',
            status: 500,
          };
          meta.setWarnings([warning]);
        });

        test('returns the expected object', () => {
          expect(meta.toObject()).toEqual({
            errors: [],
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
            warnings: [
              {
                customMessage: '<strong>123</strong> is not a valid value for <code>name</code>.',
                status: 500,
              },
            ],
          });
        });
      });

      describe('via setWarning()', () => {
        beforeEach(() => {
          req = {
            ...baseReq,
            baseUrl: '/people',
            originalUrl: '/people',
          };
          meta = new Meta(req);

          warning = {
            customMessage: '<strong>123</strong> is not a valid value for <code>name</code>.',
            status: 500,
          };
          meta.setWarning(warning);
        });

        test('returns the expected object', () => {
          expect(meta.toObject()).toEqual({
            errors: [],
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
            warnings: [
              {
                customMessage: '<strong>123</strong> is not a valid value for <code>name</code>.',
                status: 500,
              },
            ],
          });
        });
      });
    });

    describe('and a custom page title', () => {
      afterEach(() => {
        req = baseReq;
        meta = null;
      });

      describe('via setOtherValues()', () => {
        beforeEach(() => {
          req = {
            ...baseReq,
            baseUrl: '/people',
            originalUrl: '/people',
          };
          meta = new Meta(req);
          meta.setCustomPageTitle('This is a web page');
        });

        test('returns the expected object', () => {
          expect(meta.toObject()).toEqual({
            errors: [],
            pageTitle: 'This is a web page',
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
            warnings: [],
          });
        });
      });
    });

    describe('and other values', () => {
      afterEach(() => {
        req = baseReq;
        meta = null;
      });

      describe('via setOtherValues()', () => {
        beforeEach(() => {
          req = {
            ...baseReq,
            baseUrl: '/people',
            originalUrl: '/people',
          };
          meta = new Meta(req);
          meta.setOtherValues({
            description: 'A singular page',
            foo: 'bar',
            page: 2,
            pageTitle: 'Okay whatever',
            perPage: 10,
            view: 'primary',
          });
        });

        test('returns the expected object', () => {
          expect(meta.toObject()).toEqual({
            description: 'A singular page',
            errors: [],
            page: 2,
            pageTitle: 'People',
            perPage: 10,
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
            view: 'primary',
            warnings: [],
          });
        });
      });
    });
  });
});
