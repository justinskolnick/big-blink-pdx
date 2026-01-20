const EntityLobbyistLocation = require('../entity-lobbyist-location');

describe('tableName', () => {
  test('returns the expected tableName', () => {
    expect(EntityLobbyistLocation.tableName).toBe('entity_lobbyist_locations');
  });
});

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(EntityLobbyistLocation.fields()).toEqual([
      'entity_lobbyist_locations.id',
      'entity_lobbyist_locations.city',
      'entity_lobbyist_locations.region',
    ]);
  });
});

describe('primaryKey()', () => {
  test('returns the expected field', () => {
    expect(EntityLobbyistLocation.primaryKey()).toBe('entity_lobbyist_locations.id');
  });
});

describe('className()', () => {
  test('returns the expected field', () => {
    expect(EntityLobbyistLocation.className()).toBe('EntityLobbyistLocation');
  });
});

describe('foreignKey()', () => {
  test('returns the expected field', () => {
    expect(EntityLobbyistLocation.foreignKey()).toBe('entity_lobbyist_location_id');
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
