const {
  COLLECTION_ATTENDEES,
  COLLECTION_ENTITIES,
  ROLE_ENTITY,
} = require('../../../config/constants');

const Entity = require('../entity');
const EntityRole = require('../entity-role');

describe('getRoleList()', () => {
  let options = null;

  beforeAll(() => {
    options = Entity.roleOptions;
  });

  test('returns the expected values', () => {
    expect(EntityRole.getRoleList(options, null)).toEqual([]);
    expect(EntityRole.getRoleList(options, '')).toEqual([]);
    expect(EntityRole.getRoleList(options, 'entity')).toEqual([ROLE_ENTITY]);
    expect(EntityRole.getRoleList(options, 'lobbyist')).toEqual([]);
    expect(EntityRole.getRoleList(options, 'official')).toEqual([]);
    expect(EntityRole.getRoleList(options, 'lobbyist,official')).toEqual([]);
    expect(EntityRole.getRoleList(options, 'lobbyist,official,zinc')).toEqual([]);
  });
});

describe('init', () => {
  let entity;

  beforeAll(() => {
    entity = new EntityRole(ROLE_ENTITY);
  });

  test('returns the expected values', () => {
    expect(entity.hasRole).toBe(true);
    expect(entity.role).toBe(ROLE_ENTITY);
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

  beforeAll(() => {
    entity = new EntityRole(ROLE_ENTITY);
  });

  test('returns the expected object', () => {
    expect(entity.toObject()).toEqual({
      attendees: null,
      filterRole: false,
      label: 'As a lobbying entity',
      role: 'entity',
    });
  });
});
