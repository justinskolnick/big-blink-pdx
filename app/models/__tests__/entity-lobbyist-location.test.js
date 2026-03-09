const EntityLobbyistLocation = require('../entity-lobbyist-location');

describe('className()', () => {
  test('returns the expected field', () => {
    expect(EntityLobbyistLocation.className()).toBe('EntityLobbyistLocation');
  });
});

describe('adapt()', () => {
  test('adapts a result', () => {
    const result = {
      id: 1,
      city: 'Orbit City',
      region: 'WA',
    };

    const location = new EntityLobbyistLocation(result);

    expect(location.adapted).toEqual({
      city: 'Orbit City',
      id: 1,
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
      city: 'Orbit City',
      id: 1,
      region: 'WA',
    });
  });
});
