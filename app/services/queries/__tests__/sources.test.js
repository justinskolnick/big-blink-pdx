const {
  getAllQuery,
  getAtIdQuery,
  getEntitiesForIdQuery,
  getEntitiesTotalForIdQuery,
  getIdForQuarterQuery,
  getStatsQuery,
  getTotalQuery,
} = require('../sources');

describe('getAllQuery()', () => {
  describe('with default options', () => {
    test('returns the expected SQL', () => {
      const types = ['activity', 'registration'];
      const options = { types };

      expect(getAllQuery(options)).toEqual({
        clauses: [
          'SELECT',
          'data_sources.id, data_sources.type, data_sources.format, data_sources.title, data_sources.year, data_sources.quarter, data_sources.public_url, data_sources.is_via_public_records, data_sources.retrieved_at',
          'FROM data_sources',
          'WHERE',
          'type in (?,?)',
          'ORDER BY data_sources.id ASC',
        ],
        params: types,
      });
    });
  });

  describe('with counts', () => {
    test('returns the expected SQL', () => {
      const types = ['activity'];
      const options = { includeCount: true, types };

      expect(getAllQuery(options)).toEqual({
        clauses: [
          'SELECT',
          'data_sources.id, data_sources.type, data_sources.format, data_sources.title, data_sources.year, data_sources.quarter, data_sources.public_url, data_sources.is_via_public_records, data_sources.retrieved_at, COUNT(incidents.id) AS total',
          'FROM data_sources',
          'LEFT JOIN incidents ON incidents.data_source_id = data_sources.id',
          'WHERE',
          'type = ?',
          'GROUP BY incidents.data_source_id',
          'ORDER BY data_sources.id ASC',
        ],
        params: types,
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
          'data_sources.id, data_sources.type, data_sources.format, data_sources.title, data_sources.year, data_sources.quarter, data_sources.public_url, data_sources.is_via_public_records, data_sources.retrieved_at',
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
          'data_sources.id, data_sources.type, data_sources.format, data_sources.title, data_sources.year, data_sources.quarter, data_sources.public_url, data_sources.is_via_public_records, data_sources.retrieved_at',
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
      expect(getIdForQuarterQuery('2023-q2')).toEqual({
        clauses: [
          'SELECT',
          'data_sources.id',
          'FROM data_sources',
          'LEFT JOIN quarters ON data_sources.quarter_id = quarters.id',
          'WHERE',
          'quarters.slug = ?',
          'AND',
          'type = ?',
          'LIMIT 1',
        ],
        params: ['2023-q2', 'activity'],
      });
    });
  });
});

describe('getEntitiesForIdQuery()', () => {
  test('returns the expected SQL', () => {
    expect(getEntitiesForIdQuery(3)).toEqual({
      clauses: [
        'SELECT',
        'entities.id, entities.name, COUNT(incidents.entity_id) AS total',
        'FROM incidents',
        'LEFT JOIN entities ON incidents.entity_id = entities.id',
        'WHERE',
        'incidents.data_source_id = ?',
        'GROUP BY incidents.entity_id',
        'ORDER BY total DESC',
      ],
      params: [3],
    });
  });

  describe('with a limit', () => {
    test('returns the expected SQL', () => {
      expect(getEntitiesForIdQuery(3, 5)).toEqual({
        clauses: [
          'SELECT',
          'entities.id, entities.name, COUNT(incidents.entity_id) AS total',
          'FROM incidents',
          'LEFT JOIN entities ON incidents.entity_id = entities.id',
          'WHERE',
          'incidents.data_source_id = ?',
          'GROUP BY incidents.entity_id',
          'ORDER BY total DESC',
          'LIMIT ?',
        ],
        params: [3, 5],
      });
    });
  });
});

describe('getEntitiesTotalForIdQuery()', () => {
  test('returns the expected SQL', () => {
    expect(getEntitiesTotalForIdQuery(3)).toEqual({
      clauses: [
        'SELECT',
        'COUNT(DISTINCT incidents.entity_id) AS total',
        'FROM incidents',
        'LEFT JOIN entities ON incidents.entity_id = entities.id',
        'WHERE',
        'incidents.data_source_id = ?',
      ],
      params: [3],
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
    const types = ['activity', 'registration'];
    const options = { types };

    expect(getTotalQuery(options)).toEqual({
      clauses: [
        'SELECT',
        'COUNT(data_sources.id) AS total',
        'FROM data_sources',
        'WHERE',
        'type in (?,?)',
      ],
      params: types,
    });
  });
});
