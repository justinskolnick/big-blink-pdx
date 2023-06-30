const {
  getAllQuery,
  getAtIdQuery,
  getIdForQuarterQuery,
  getStatsQuery,
  getTotalQuery,
} = require('../sources');

describe('getAllQuery()', () => {
  describe('with default options', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery()).toEqual({
        clauses: [
          'SELECT',
          'data_sources.id, data_sources.type, data_sources.format, data_sources.title, data_sources.year, data_sources.quarter, data_sources.public_url, data_sources.retrieved_at',
          'FROM data_sources',
          'WHERE',
          'type = ?',
          'ORDER BY data_sources.id ASC',
        ],
        params: ['activity'],
      });
    });
  });

  describe('with counts', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery({ includeCount: true })).toEqual({
        clauses: [
          'SELECT',
          'data_sources.id, data_sources.type, data_sources.format, data_sources.title, data_sources.year, data_sources.quarter, data_sources.public_url, data_sources.retrieved_at, COUNT(incidents.id) AS total',
          'FROM data_sources',
          'LEFT JOIN incidents ON incidents.data_source_id = data_sources.id',
          'WHERE',
          'type = ?',
          'GROUP BY incidents.data_source_id',
          'ORDER BY data_sources.id ASC',
        ],
        params: ['activity'],
      });
    });
  });
});

describe('getAtIdQuery()', () => {
  describe('with no id', () => {
    test('returns the expected SQL', () => {
      // todo
      expect(getAtIdQuery()).toEqual({
        clauses: [
          'SELECT',
          'data_sources.id, data_sources.type, data_sources.format, data_sources.title, data_sources.year, data_sources.quarter, data_sources.public_url, data_sources.retrieved_at',
          'FROM data_sources',
          'WHERE',
          'id = ?',
          'LIMIT 1',
        ],
        params: [undefined],
      });
    });
  });

  describe('with an id', () => {
    test('returns the expected SQL', () => {
      expect(getAtIdQuery(8675309)).toEqual({
        clauses: [
          'SELECT',
          'data_sources.id, data_sources.type, data_sources.format, data_sources.title, data_sources.year, data_sources.quarter, data_sources.public_url, data_sources.retrieved_at',
          'FROM data_sources',
          'WHERE',
          'id = ?',
          'LIMIT 1',
        ],
        params: [8675309],
      });
    });
  });
});

describe('getIdForQuarterQuery()', () => {
  describe('with no quarter', () => {
    test.skip('throws', () => {
      // todo
    });
  });

  describe('with an quarter', () => {
    test('returns the expected SQL', () => {
      expect(getIdForQuarterQuery('Q2-2023')).toEqual({
        clauses: [
          'SELECT',
          'id',
          'FROM data_sources',
          'WHERE',
          'year = ? AND quarter = ?',
          'AND',
          'type = ?',
          'LIMIT 1',
        ],
        params: [2023, 2, 'activity'],
      });
    });
  });
});

describe('getStatsQuery()', () => {
  test('returns the expected SQL', () => {
    expect(getStatsQuery()).toEqual({
      clauses: [
        'SELECT',
        'data_sources.id, data_sources.year, data_sources.quarter, COUNT(incidents.id) AS total',
        'FROM data_sources',
        'LEFT JOIN incidents ON incidents.data_source_id = data_sources.id',
        'WHERE',
        'type = ?',
        'GROUP BY incidents.data_source_id',
        'ORDER BY data_sources.id ASC',
      ],
      params: ['activity'],
    });
  });
});

describe('getTotalQuery()', () => {
  test('returns the expected SQL', () => {
    expect(getTotalQuery()).toEqual({
      clauses: [
        'SELECT',
        'COUNT(id) AS total',
        'FROM data_sources',
        'WHERE',
        'type = ?',
      ],
      params: ['activity'],
    });
  });
});
