const {
  getTotalQuery,
} = require('../entity-lobbyist-registrations');

describe('getTotalQuery()', () => {
  describe('with default options', () => {
    test('returns the expected SQL', () => {
      expect(getTotalQuery()).toEqual({
        clauses: [
          'SELECT',
          'COUNT(id) AS total',
          'FROM entity_lobbyist_registrations',
        ],
        params: [],
      });
    });
  });

  describe('with an entityId', () => {
    test('returns the expected SQL', () => {
      expect(getTotalQuery({ entityId: 123 })).toEqual({
        clauses: [
          'SELECT',
          'COUNT(id) AS total',
          'FROM entity_lobbyist_registrations',
          'WHERE',
          'entity_lobbyist_registrations.entity_id = ?',
        ],
        params: [123],
      });
    });
  });

  describe('with a personId', () => {
    test('returns the expected SQL', () => {
      expect(getTotalQuery({ personId: 321 })).toEqual({
        clauses: [
          'SELECT',
          'COUNT(id) AS total',
          'FROM entity_lobbyist_registrations',
          'WHERE',
          'entity_lobbyist_registrations.person_id = ?',
        ],
        params: [321],
      });
    });
  });

  describe('with an entityId and a personId', () => {
    test('returns the expected SQL', () => {
      expect(getTotalQuery({ entityId: 123, personId: 321 })).toEqual({
        clauses: [
          'SELECT',
          'COUNT(id) AS total',
          'FROM entity_lobbyist_registrations',
          'WHERE',
          'entity_lobbyist_registrations.entity_id = ? AND entity_lobbyist_registrations.person_id = ?',
        ],
        params: [123, 321],
      });
    });
  });
});
