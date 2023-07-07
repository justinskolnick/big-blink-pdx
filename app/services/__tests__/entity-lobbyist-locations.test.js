const {
  getAllQuery,
} = require('../entity-lobbyist-locations');

describe('getAllQuery()', () => {
  describe('with default options', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery()).toEqual({
        clauses: [],
        params: [],
      });
    });
  });

  describe('with an entityId', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery({ entityId: 123 })).toEqual({
        clauses: [
          'SELECT',
          'entity_lobbyist_locations.id, entity_lobbyist_locations.entity_id, entity_lobbyist_locations.city, entity_lobbyist_locations.region',
          'FROM entity_lobbyist_locations',
          'WHERE',
          'entity_id = ?',
          'ORDER BY',
          'entity_lobbyist_locations.region DESC, entity_lobbyist_locations.city ASC',
        ],
        params: [123],
      });
    });
  });
});
