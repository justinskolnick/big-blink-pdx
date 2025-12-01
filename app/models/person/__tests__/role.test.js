const {
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../../config/constants');

const Role = require('../role');

describe('getList()', () => {
  test('returns the expected values', () => {
    expect(Role.getList(null)).toEqual([]);
    expect(Role.getList('')).toEqual([]);
    expect(Role.getList('lobbyist')).toEqual([ROLE_LOBBYIST]);
    expect(Role.getList('official')).toEqual([ROLE_OFFICIAL]);
    expect(Role.getList('lobbyist,official')).toEqual([ROLE_LOBBYIST, ROLE_OFFICIAL]);
    expect(Role.getList('lobbyist,official,zinc')).toEqual([ROLE_LOBBYIST, ROLE_OFFICIAL]);
  });
});

describe('isValidOption()', () => {
  test('returns the expected values', () => {
    expect(Role.isValidOption(ROLE_LOBBYIST)).toBe(true);
    expect(Role.isValidOption(ROLE_OFFICIAL)).toBe(true);
    expect(Role.isValidOption('nada')).toBe(false);
    expect(Role.isValidOption('')).toBe(false);
    expect(Role.isValidOption({})).toBe(false);
    expect(Role.isValidOption(null)).toBe(false);
  });
});

describe('options()', () => {
  test('returns the expected options', () => {
    expect(Role.options()).toEqual([
      ROLE_LOBBYIST,
      ROLE_OFFICIAL,
    ]);
  });
});

describe('role()', () => {
  let nully;
  let lobbyist;
  let official;

  beforeAll(() => {
    nully = new Role();
    lobbyist = new Role(ROLE_LOBBYIST);
    official = new Role(ROLE_OFFICIAL);
  });

  test('returns the expected role', () => {
    expect(nully.role).toBe(null);
    expect(lobbyist.role).toBe(ROLE_LOBBYIST);
    expect(official.role).toBe(ROLE_OFFICIAL);
  });
});
