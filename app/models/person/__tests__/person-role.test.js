const {
  COLLECTION_ATTENDEES,
  COLLECTION_ENTITIES,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../../config/constants');

const Person = require('../person');
const PersonRole = require('../person-role');

describe('getRoleList()', () => {
  let options = null;

  beforeAll(() => {
    options = Person.roleOptions;
  });

  test('returns the expected values', () => {
    expect(PersonRole.getRoleList(options, null)).toEqual([]);
    expect(PersonRole.getRoleList(options, '')).toEqual([]);
    expect(PersonRole.getRoleList(options, 'entity')).toEqual([]);
    expect(PersonRole.getRoleList(options, 'lobbyist')).toEqual([ROLE_LOBBYIST]);
    expect(PersonRole.getRoleList(options, 'official')).toEqual([ROLE_OFFICIAL]);
    expect(PersonRole.getRoleList(options, 'lobbyist,official')).toEqual([ROLE_OFFICIAL, ROLE_LOBBYIST]);
    expect(PersonRole.getRoleList(options, 'lobbyist,official,zinc')).toEqual([ROLE_OFFICIAL, ROLE_LOBBYIST]);
  });
});

describe('init', () => {
  let lobbyist;
  let official;

  beforeAll(() => {
    lobbyist = new PersonRole(ROLE_LOBBYIST);
    official = new PersonRole(ROLE_OFFICIAL);
  });

  test('returns the expected values', () => {
    expect(lobbyist.hasRole).toBe(true);
    expect(official.hasRole).toBe(true);
    expect(lobbyist.role).toBe(ROLE_LOBBYIST);
    expect(official.role).toBe(ROLE_OFFICIAL);
  });
});

describe('collections', () => {
  let lobbyist;

  beforeAll(() => {
    lobbyist = new PersonRole(ROLE_LOBBYIST);

    lobbyist.setCollection(COLLECTION_ATTENDEES, [1, 2, 3]);
    lobbyist.setCollection(COLLECTION_ENTITIES, [4, 5, 6]);
  });

  describe('hasCollection()', () => {
    test('returns the expected values', () => {
      expect(lobbyist.hasCollection(COLLECTION_ATTENDEES)).toBe(true);
      expect(lobbyist.hasCollection(COLLECTION_ENTITIES)).toBe(true);
    });
  });

  describe('getCollection()', () => {
    test('returns the expected values', () => {
      expect(lobbyist.getCollection(COLLECTION_ATTENDEES)).toEqual([1, 2, 3]);
      expect(lobbyist.getCollection(COLLECTION_ENTITIES)).toEqual([4, 5, 6]);
    });
  });
});

describe('toObject()', () => {
  let lobbyist;
  let official;

  beforeAll(() => {
    lobbyist = new PersonRole(ROLE_LOBBYIST);
    lobbyist.setCollection(COLLECTION_ATTENDEES, [1, 2, 3]);

    official = new PersonRole(ROLE_OFFICIAL);
  });

  test('returns the expected object', () => {
    expect(lobbyist.toObject()).toHaveProperty('attendees');
    expect(lobbyist.toObject()).toHaveProperty('entities');
    expect(lobbyist.toObject()).toEqual({
      attendees: [1, 2, 3],
      entities: null,
      filterRole: true,
      label: 'As a lobbyist',
      role: 'lobbyist',
    });
    expect(official.toObject()).toEqual({
      attendees: null,
      entities: null,
      filterRole: true,
      label: 'As a City official',
      role: 'official',
    });
  });
});
