const {
  COLLECTION_ATTENDEES,
  COLLECTION_ENTITIES,
  ROLE_ENTITY,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../../config/constants');

const PersonRole = require('../person-role');

describe('getList()', () => {
  test('returns the expected values', () => {
    expect(PersonRole.getList(null)).toEqual([]);
    expect(PersonRole.getList('')).toEqual([]);
    expect(PersonRole.getList('entity')).toEqual([]);
    expect(PersonRole.getList('lobbyist')).toEqual([ROLE_LOBBYIST]);
    expect(PersonRole.getList('official')).toEqual([ROLE_OFFICIAL]);
    expect(PersonRole.getList('lobbyist,official')).toEqual([ROLE_OFFICIAL, ROLE_LOBBYIST]);
    expect(PersonRole.getList('lobbyist,official,zinc')).toEqual([ROLE_OFFICIAL, ROLE_LOBBYIST]);
  });
});

describe('isValidOption()', () => {
  test('returns the expected values', () => {
    expect(PersonRole.isValidOption(ROLE_ENTITY)).toBe(false);
    expect(PersonRole.isValidOption(ROLE_LOBBYIST)).toBe(true);
    expect(PersonRole.isValidOption(ROLE_OFFICIAL)).toBe(true);
    expect(PersonRole.isValidOption('nada')).toBe(false);
    expect(PersonRole.isValidOption('')).toBe(false);
    expect(PersonRole.isValidOption({})).toBe(false);
    expect(PersonRole.isValidOption(null)).toBe(false);
  });
});

describe('options()', () => {
  test('returns the expected options', () => {
    expect(PersonRole.options()).toEqual([
      ROLE_OFFICIAL,
      ROLE_LOBBYIST,
    ]);
  });
});

describe('hasRole()', () => {
  let nully;
  let entity;
  let lobbyist;
  let official;

  beforeAll(() => {
    nully = new PersonRole();
    entity = new PersonRole(null);
    lobbyist = new PersonRole(ROLE_LOBBYIST);
    official = new PersonRole(ROLE_OFFICIAL);
  });

  test('returns the expected role', () => {
    expect(nully.hasRole).toBe(false);
    expect(entity.hasRole).toBe(false);
    expect(lobbyist.hasRole).toBe(true);
    expect(official.hasRole).toBe(true);
  });
});

describe('role()', () => {
  let nully;
  let entity;
  let lobbyist;
  let official;

  beforeAll(() => {
    nully = new PersonRole();
    entity = new PersonRole(null);
    lobbyist = new PersonRole(ROLE_LOBBYIST);
    official = new PersonRole(ROLE_OFFICIAL);
  });

  test('returns the expected role', () => {
    expect(nully.role).toBe(null);
    expect(entity.role).toBe(null);
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
  let entity;
  let lobbyist;
  let official;

  beforeAll(() => {
    entity = new PersonRole(ROLE_ENTITY);

    lobbyist = new PersonRole(ROLE_LOBBYIST);
    lobbyist.setCollection(COLLECTION_ATTENDEES, [1, 2, 3]);

    official = new PersonRole(ROLE_OFFICIAL);
  });

  test('returns the expected object', () => {
    expect(entity.toObject()).toBe(null);
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
