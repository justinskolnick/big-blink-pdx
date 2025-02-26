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
    /* eslint-disable camelcase */
    const location = new EntityLobbyistLocation({
      id: 1,
      data_source_id: 2,
      entity_id: 4,
      city: 'Orbit City',
      region: 'WA',
    });
    /* eslint-enable camelcase */

    location.setData('z', 'abc');

    /* eslint-disable camelcase */
    expect(location.data).toEqual({
      id: 1,
      data_source_id: 2,
      entity_id: 4,
      city: 'Orbit City',
      region: 'WA',
      z: 'abc',
    });
    /* eslint-enable camelcase */

    expect(location.adapted).toEqual({
      id: 1,
      city: 'Orbit City',
      region: 'WA',
    });
  });
});
