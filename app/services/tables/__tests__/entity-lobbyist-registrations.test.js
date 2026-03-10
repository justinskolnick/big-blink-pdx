const EntityLobbyistRegistrations = require('../entity-lobbyist-registrations');

describe('className()', () => {
  test('returns the expected field', () => {
    expect(EntityLobbyistRegistrations.className()).toBe('EntityLobbyistRegistrations');
  });
});

describe('tableName()', () => {
  test('returns the expected tableName', () => {
    expect(EntityLobbyistRegistrations.tableName()).toBe('entity_lobbyist_registrations');
  });
});

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(EntityLobbyistRegistrations.fields()).toEqual([
      'entity_lobbyist_registrations.id',
      'entity_lobbyist_registrations.entity_id',
      'entity_lobbyist_registrations.person_id',
    ]);
  });
});

describe('primaryKey()', () => {
  test('returns the expected field', () => {
    expect(EntityLobbyistRegistrations.primaryKey()).toBe('entity_lobbyist_registrations.id');
  });
});

describe('foreignKey()', () => {
  test('returns the expected field', () => {
    expect(EntityLobbyistRegistrations.foreignKey()).toBe('entity_lobbyist_registration_id');
  });
});
