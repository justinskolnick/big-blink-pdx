const {
  ROLE_ENTITY,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../config/constants');

const Entity = require('../entity/entity');
const Person = require('../person/person');
const Role = require('../role');

describe('getRoleList()', () => {
  let options = null;

  describe('with an entity', () => {
    beforeAll(() => {
      options = Entity.roleOptions;
    });

    afterAll(() => {
      options = null;
    });

    test('returns the expected values', () => {
      expect(Role.getRoleList(options, null)).toEqual([]);
      expect(Role.getRoleList(options, '')).toEqual([]);
      expect(Role.getRoleList(options, 'entity')).toEqual([ROLE_ENTITY]);
      expect(Role.getRoleList(options, 'lobbyist')).toEqual([]);
      expect(Role.getRoleList(options, 'official')).toEqual([]);
      expect(Role.getRoleList(options, 'lobbyist,official')).toEqual([]);
      expect(Role.getRoleList(options, 'lobbyist,official,zinc')).toEqual([]);
      expect(Role.getRoleList(options, 'lobbyist,official,entity')).toEqual([ROLE_ENTITY]);
    });
  });

  describe('with a person', () => {
    beforeAll(() => {
      options = Person.roleOptions;
    });

    afterAll(() => {
      options = null;
    });

    test('returns the expected values', () => {
      expect(Role.getRoleList(options, null)).toEqual([]);
      expect(Role.getRoleList(options, '')).toEqual([]);
      expect(Role.getRoleList(options, 'entity')).toEqual([]);
      expect(Role.getRoleList(options, 'lobbyist')).toEqual([ROLE_LOBBYIST]);
      expect(Role.getRoleList(options, 'official')).toEqual([ROLE_OFFICIAL]);
      expect(Role.getRoleList(options, 'lobbyist,official')).toEqual([ROLE_OFFICIAL, ROLE_LOBBYIST]);
      expect(Role.getRoleList(options, 'lobbyist,official,zinc')).toEqual([ROLE_OFFICIAL, ROLE_LOBBYIST]);
      expect(Role.getRoleList(options, 'lobbyist,official,entity')).toEqual([ROLE_OFFICIAL, ROLE_LOBBYIST]);
    });
  });
});
