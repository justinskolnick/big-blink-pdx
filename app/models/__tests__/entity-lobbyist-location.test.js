const EntityLobbyistLocation = require('../entity-lobbyist-location');

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(EntityLobbyistLocation.fields()).toEqual([
      'entity_lobbyist_locations.id',
      'entity_lobbyist_locations.city',
      'entity_lobbyist_locations.region',
    ]);
  });
});

describe('adapt()', () => {
  test('adapts a result', () => {
    expect(EntityLobbyistLocation.adapt({
      id: 1,
      city: 'Orbit City',
      region: 'WA',
    })).toEqual({
      id: 1,
      city: 'Orbit City',
      region: 'WA',
    });
  });

  test('sets data', () => {
    const location = new EntityLobbyistLocation({
      x: 'y',
    });

    location.setData('z', 'abc');

    expect(location.data).toEqual({
      x: 'y',
      z: 'abc',
    });

    expect(location.adapted).toEqual({
      // ???
    });
  });
});
