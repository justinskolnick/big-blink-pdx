const {
  getQuartersQuery,
  getTotalQuery,
  getHasBeenCityEmployeeQuery,
} = require('../entity-lobbyist-registrations');

describe('getQuartersQuery()', () => {
  describe('with default options', () => {
    test('returns the expected SQL', () => {
      expect(getQuartersQuery()).toEqual({
        clauses: [
          'SELECT',
          'data_sources.quarter, data_sources.year',
          'FROM entity_lobbyist_registrations',
          'LEFT JOIN data_sources ON entity_lobbyist_registrations.data_source_id = data_sources.id',
          'ORDER BY',
          'data_sources.year ASC, data_sources.quarter ASC',
        ],
        params: [],
      });
    });
  });

  describe('with an entityId', () => {
    test('returns the expected SQL', () => {
      expect(getQuartersQuery({ entityId: 123 })).toEqual({
        clauses: [
          'SELECT',
          'data_sources.quarter, data_sources.year',
          'FROM entity_lobbyist_registrations',
          'LEFT JOIN data_sources ON entity_lobbyist_registrations.data_source_id = data_sources.id',
          'WHERE',
          'entity_lobbyist_registrations.entity_id = ?',
          'ORDER BY',
          'data_sources.year ASC, data_sources.quarter ASC',
        ],
        params: [123],
      });
    });
  });

  describe('with a personId', () => {
    test('returns the expected SQL', () => {
      expect(getQuartersQuery({ personId: 321 })).toEqual({
        clauses: [
          'SELECT',
          'data_sources.quarter, data_sources.year',
          'FROM entity_lobbyist_registrations',
          'LEFT JOIN data_sources ON entity_lobbyist_registrations.data_source_id = data_sources.id',
          'WHERE',
          'entity_lobbyist_registrations.person_id = ?',
          'ORDER BY',
          'data_sources.year ASC, data_sources.quarter ASC',
        ],
        params: [321],
      });
    });
  });

  describe('with an entityId and a personId', () => {
    test('returns the expected SQL', () => {
      expect(getQuartersQuery({ entityId: 123, personId: 321 })).toEqual({
        clauses: [
          'SELECT',
          'data_sources.quarter, data_sources.year',
          'FROM entity_lobbyist_registrations',
          'LEFT JOIN data_sources ON entity_lobbyist_registrations.data_source_id = data_sources.id',
          'WHERE',
          'entity_lobbyist_registrations.entity_id = ?',
          'AND',
          'entity_lobbyist_registrations.person_id = ?',
          'ORDER BY',
          'data_sources.year ASC, data_sources.quarter ASC',
        ],
        params: [123, 321],
      });
    });
  });
});

describe('getTotalQuery()', () => {
  describe('with default options', () => {
    test('returns the expected SQL', () => {
      expect(getTotalQuery()).toEqual({
        clauses: [
          'SELECT',
          'COUNT(entity_lobbyist_registrations.id) AS total',
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
          'COUNT(entity_lobbyist_registrations.id) AS total',
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
          'COUNT(entity_lobbyist_registrations.id) AS total',
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
          'COUNT(entity_lobbyist_registrations.id) AS total',
          'FROM entity_lobbyist_registrations',
          'WHERE',
          'entity_lobbyist_registrations.entity_id = ?',
          'AND',
          'entity_lobbyist_registrations.person_id = ?',
        ],
        params: [123, 321],
      });
    });
  });
});

describe('getHasBeenCityEmployeeQuery()', () => {
  describe('with a personId', () => {
    test('returns the expected SQL', () => {
      expect(getHasBeenCityEmployeeQuery({ personId: 123 })).toEqual({
        clauses: [
          'SELECT',
          "IF(COUNT(entity_lobbyist_registrations.id) > 0, 'true', 'false') AS hasBeenEmployee",
          'FROM entity_lobbyist_registrations',
          'WHERE',
          'entity_lobbyist_registrations.was_city_employee = 1',
          'AND',
          'entity_lobbyist_registrations.length_of_employment IS NOT NULL',
          'AND',
          'entity_lobbyist_registrations.person_id = ?',
        ],
        params: [123],
      });
    });
  });
});
