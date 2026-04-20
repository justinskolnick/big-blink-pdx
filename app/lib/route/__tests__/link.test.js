const Link = require('../link');

const getLink = (pathname, label) => {
  const l = new Link(pathname, label);
  return l.toObject();
};

describe('toObject()', () => {
  test('returns the expected object', () => {
    expect(getLink()).toEqual({
      label: undefined,
      params: undefined,
      pathname: undefined,
    });
    expect(getLink('/', 'Home')).toEqual({
      label: 'Home',
      params: undefined,
      pathname: '/',
    });
    expect(getLink('/people', 'People')).toEqual({
      label: 'People',
      params: undefined,
      pathname: '/people',
    });
    expect(getLink('/people?page=2', 'People')).toEqual({
      label: 'People',
      params: {
        page: 2,
      },
      pathname: '/people',
    });
    expect(getLink('/people?page=2&sort=ASC', 'People')).toEqual({
      label: 'People',
      params: {
        page: 2,
        sort: 'ASC',
      },
      pathname: '/people',
    });
    expect(getLink('/people/2062', 'George Jetson')).toEqual({
      label: 'George Jetson',
      params: undefined,
      pathname: '/people/2062',
    });
    expect(getLink('/people/2062?page=2', 'George Jetson')).toEqual({
      label: 'George Jetson',
      params: {
        page: 2,
      },
      pathname: '/people/2062',
    });
    expect(getLink('/people/2062?page=2&sort=ASC', 'George Jetson')).toEqual({
      label: 'George Jetson',
      params: {
        page: 2,
        sort: 'ASC',
      },
      pathname: '/people/2062',
    });
  });
});
