const EntityLobbyistRegistration = require('../entity-lobbyist-registration');

describe('tableName', () => {
  test('returns the expected tableName', () => {
    expect(EntityLobbyistRegistration.tableName).toBe('entity_lobbyist_registrations');
  });
});

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(EntityLobbyistRegistration.fields()).toEqual([
      'entity_lobbyist_registrations.id',
      'entity_lobbyist_registrations.entity_id',
      'entity_lobbyist_registrations.person_id',
    ]);
  });
});

describe('primaryKey()', () => {
  test('returns the expected field', () => {
    expect(EntityLobbyistRegistration.primaryKey()).toBe('entity_lobbyist_registrations.id');
  });
});

describe('foreignKey()', () => {
  test('returns the expected field', () => {
    expect(EntityLobbyistRegistration.foreignKey()).toBe('entity_lobbyist_registration_id');
  });
});

describe('adapt()', () => {
  test('adapts a result', () => {
    const result = {
      quarter: 1,
      year: 2024,
    };

    const registration = new EntityLobbyistRegistration(result);

    expect(registration.adapted).toEqual({
      quarter: 1,
      year: 2024,
    });
  });
});

describe('setData()', () => {
  test('sets data', () => {
    const registration = new EntityLobbyistRegistration({
      quarter: 1,
      year: 2024,
    });

    registration.setData('z', 'abc');

    expect(registration.data).toEqual({
      quarter: 1,
      year: 2024,
      z: 'abc',
    });

    expect(registration.adapted).toEqual({
      quarter: 1,
      year: 2024,
    });
  });
});
