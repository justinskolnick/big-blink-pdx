const EntityLobbyistLocations = require('../entity-lobbyist-locations');

describe('className()', () => {
  test('returns the expected field', () => {
    expect(EntityLobbyistLocations.className()).toBe('EntityLobbyistLocations');
  });
});

describe('tableName()', () => {
  test('returns the expected tableName', () => {
    expect(EntityLobbyistLocations.tableName()).toBe('entity_lobbyist_locations');
  });
});

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(EntityLobbyistLocations.fields()).toEqual([
      'entity_lobbyist_locations.id',
      'entity_lobbyist_locations.city',
      'entity_lobbyist_locations.region',
    ]);
  });
});

describe('primaryKey()', () => {
  test('returns the expected field', () => {
    expect(EntityLobbyistLocations.primaryKey()).toBe('entity_lobbyist_locations.id');
  });
});

describe('foreignKey()', () => {
  test('returns the expected field', () => {
    expect(EntityLobbyistLocations.foreignKey()).toBe('entity_lobbyist_location_id');
  });
});
