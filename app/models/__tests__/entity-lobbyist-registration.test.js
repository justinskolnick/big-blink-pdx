const EntityLobbyistRegistration = require('../entity-lobbyist-registration');

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(EntityLobbyistRegistration.fields()).toEqual([
      'entity_lobbyist_registrations.id',
      'entity_lobbyist_registrations.entity_id',
      'entity_lobbyist_registrations.person_id',
    ]);
  });
});

describe('adapt()', () => {
  test('adapts a result', () => {
    expect(EntityLobbyistRegistration.adapt({
      quarter: 1,
      year: 2024,
    })).toEqual({
      quarter: 1,
      year: 2024,
    });
  });

  test('sets data', () => {
    const registration = new EntityLobbyistRegistration({
      x: 'y',
    });

    registration.setData('z', 'abc');

    expect(registration.data).toEqual({
      x: 'y',
      z: 'abc',
    });

    expect(registration.adapted).toEqual({
      // ???
    });
  });
});
