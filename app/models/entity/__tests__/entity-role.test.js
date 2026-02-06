const {
  COLLECTION_ATTENDEES,
  COLLECTION_ENTITIES,
  ROLE_ENTITY,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../../config/constants');

const EntityRole = require('../entity-role');

describe('getList()', () => {
  test('returns the expected values', () => {
    expect(EntityRole.getList(null)).toEqual([]);
    expect(EntityRole.getList('')).toEqual([]);
    expect(EntityRole.getList('entity')).toEqual([ROLE_ENTITY]);
    expect(EntityRole.getList('lobbyist')).toEqual([]);
    expect(EntityRole.getList('official')).toEqual([]);
    expect(EntityRole.getList('lobbyist,official')).toEqual([]);
    expect(EntityRole.getList('lobbyist,official,zinc')).toEqual([]);
  });
});

describe('isValidOption()', () => {
  test('returns the expected values', () => {
    expect(EntityRole.isValidOption(ROLE_ENTITY)).toBe(true);
    expect(EntityRole.isValidOption(ROLE_LOBBYIST)).toBe(false);
    expect(EntityRole.isValidOption(ROLE_OFFICIAL)).toBe(false);
    expect(EntityRole.isValidOption('nada')).toBe(false);
    expect(EntityRole.isValidOption('')).toBe(false);
    expect(EntityRole.isValidOption({})).toBe(false);
    expect(EntityRole.isValidOption(null)).toBe(false);
  });
});

describe('options()', () => {
  test('returns the expected options', () => {
    expect(EntityRole.options()).toEqual([
      ROLE_ENTITY,
    ]);
  });
});

describe('hasRole()', () => {
  let nully;
  let entity;
  let lobbyist;
  let official;

  beforeAll(() => {
    nully = new EntityRole();
    entity = new EntityRole(ROLE_ENTITY);
    lobbyist = new EntityRole(ROLE_LOBBYIST);
    official = new EntityRole(ROLE_OFFICIAL);
  });

  test('returns the expected role', () => {
    expect(nully.hasRole).toBe(false);
    expect(entity.hasRole).toBe(true);
    expect(lobbyist.hasRole).toBe(false);
    expect(official.hasRole).toBe(false);
  });
});

describe('role()', () => {
  let nully;
  let entity;
  let lobbyist;
  let official;

  beforeAll(() => {
    nully = new EntityRole();
    entity = new EntityRole(ROLE_ENTITY);
    lobbyist = new EntityRole(ROLE_LOBBYIST);
    official = new EntityRole(ROLE_OFFICIAL);
  });

  test('returns the expected role', () => {
    expect(nully.role).toBe(null);
    expect(entity.role).toBe(ROLE_ENTITY);
    expect(lobbyist.role).toBe(null);
    expect(official.role).toBe(null);
  });
});

describe('collections', () => {
  let entity;

  beforeAll(() => {
    entity = new EntityRole(ROLE_ENTITY);

    entity.setCollection(COLLECTION_ATTENDEES, [1, 2, 3]);
    entity.setCollection(COLLECTION_ENTITIES, [4, 5, 6]);
  });

  describe('hasCollection()', () => {
    test('returns the expected values', () => {
      expect(entity.hasCollection(COLLECTION_ATTENDEES)).toBe(true);
      expect(entity.hasCollection(COLLECTION_ENTITIES)).toBe(false);
    });
  });

  describe('getCollection()', () => {
    test('returns the expected values', () => {
      expect(entity.getCollection(COLLECTION_ATTENDEES)).toEqual([1, 2, 3]);
      expect(entity.getCollection(COLLECTION_ENTITIES)).toEqual(null);
    });
  });
});

describe('toObject()', () => {
  let entity;
  let lobbyist;

  beforeAll(() => {
    entity = new EntityRole(ROLE_ENTITY);
    lobbyist = new EntityRole(ROLE_LOBBYIST);
  });

  test('returns the expected object', () => {
    expect(entity.toObject()).toEqual({
      attendees: null,
      filterRole: false,
      label: 'As a lobbying entity',
      role: 'entity',
    });
    expect(lobbyist.toObject()).toBe(null);
  });
});
