const { SORT_DESC, SORT_BY_NAME, SORT_BY_TOTAL } = require('../../../config/constants');

const {
  getAllQuery,
  getAtIdQuery,
  getTotalQuery,
} = require('../entities');

describe('getAllQuery()', () => {
  describe('with default options', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery()).toEqual({
        clauses: [
          'SELECT',
          "entities.id, entities.name, entities.domain, CASE WHEN entities.name LIKE 'The %' THEN TRIM(SUBSTR(entities.name FROM 4)) ELSE entities.name END AS sort_name",
          'FROM entities',
          'ORDER BY',
          'sort_name ASC',
        ],
        params: [],
      });
    });
  });

  describe('with a page number', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery({ page: 4 })).toEqual({
        clauses: [
          'SELECT',
          "entities.id, entities.name, entities.domain, CASE WHEN entities.name LIKE 'The %' THEN TRIM(SUBSTR(entities.name FROM 4)) ELSE entities.name END AS sort_name",
          'FROM entities',
          'ORDER BY',
          'sort_name ASC',
        ],
        params: [],
      });
    });

    describe('and perpage', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({ page: 4, perPage: 15 })).toEqual({
          clauses: [
            'SELECT',
            "entities.id, entities.name, entities.domain, CASE WHEN entities.name LIKE 'The %' THEN TRIM(SUBSTR(entities.name FROM 4)) ELSE entities.name END AS sort_name",
            'FROM entities',
            'ORDER BY',
            'sort_name ASC',
            'LIMIT ?,?',
          ],
          params: [45, 15],
        });
      });
    });
  });

  describe('with a date range', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery({
        dateRangeFrom: '2016-04-01',
        dateRangeTo: '2016-06-30',
      })).toEqual({
        clauses: [
          'SELECT',
          "entities.id, entities.name, entities.domain, CASE WHEN entities.name LIKE 'The %' THEN TRIM(SUBSTR(entities.name FROM 4)) ELSE entities.name END AS sort_name",
          'FROM entities',
          'LEFT JOIN incidents ON incidents.entity_id = entities.id',
          'WHERE',
          '(incidents.contact_date BETWEEN ? AND ? OR incidents.contact_date_end BETWEEN ? AND ?)',
          'GROUP BY entities.id',
          'ORDER BY',
          'sort_name ASC',
        ],
        params: [
          '2016-04-01',
          '2016-06-30',
          '2016-04-01',
          '2016-06-30',
        ],
      });
    });
  });

  describe('with a year', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery({
        year: 2016,
      })).toEqual({
        clauses: [
          'SELECT',
          "entities.id, entities.name, entities.domain, CASE WHEN entities.name LIKE 'The %' THEN TRIM(SUBSTR(entities.name FROM 4)) ELSE entities.name END AS sort_name",
          'FROM entities',
          'LEFT JOIN incidents ON incidents.entity_id = entities.id',
          'WHERE',
          'SUBSTRING(incidents.contact_date, 1, 4) = ?',
          'GROUP BY entities.id',
          'ORDER BY',
          'sort_name ASC',
        ],
        params: [2016],
      });
    });
  });

  describe('with a limit', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery({ limit: 5 })).toEqual({
        clauses: [
          'SELECT',
          "entities.id, entities.name, entities.domain, CASE WHEN entities.name LIKE 'The %' THEN TRIM(SUBSTR(entities.name FROM 4)) ELSE entities.name END AS sort_name",
          'FROM entities',
          'ORDER BY',
          'sort_name ASC',
          'LIMIT ?,?',
        ],
        params: [0, 5],
      });
    });
  });

  describe('with counts', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery({ includeTotal: true })).toEqual({
        clauses: [
          'SELECT',
          "entities.id, entities.name, entities.domain, COUNT(incidents.id) AS total, CASE WHEN entities.name LIKE 'The %' THEN TRIM(SUBSTR(entities.name FROM 4)) ELSE entities.name END AS sort_name",
          'FROM entities',
          'LEFT JOIN incidents ON incidents.entity_id = entities.id',
          'GROUP BY entities.id',
          'ORDER BY',
          'sort_name ASC',
        ],
        params: [],
      });
    });

    describe('and sorting', () => {
      describe('with sort_by', () => {
        test('returns the expected SQL', () => {
          expect(getAllQuery({
            includeTotal: true,
            sortBy: SORT_BY_TOTAL,
          })).toEqual({
            clauses: [
              'SELECT',
              'entities.id, entities.name, entities.domain, COUNT(incidents.id) AS total',
              'FROM entities',
              'LEFT JOIN incidents ON incidents.entity_id = entities.id',
              'GROUP BY entities.id',
              'ORDER BY',
              'total DESC',
            ],
            params: [],
          });
        });
      });

      describe('with sort_by and sort', () => {
        test('returns the expected SQL', () => {
          expect(getAllQuery({
            includeTotal: true,
            sort: SORT_DESC,
            sortBy: SORT_BY_NAME,
          })).toEqual({
            clauses: [
              'SELECT',
              "entities.id, entities.name, entities.domain, COUNT(incidents.id) AS total, CASE WHEN entities.name LIKE 'The %' THEN TRIM(SUBSTR(entities.name FROM 4)) ELSE entities.name END AS sort_name",
              'FROM entities',
              'LEFT JOIN incidents ON incidents.entity_id = entities.id',
              'GROUP BY entities.id',
              'ORDER BY',
              'sort_name DESC',
            ],
            params: [],
          });
        });
      });
    });
  });
});

describe('getAtIdQuery()', () => {
  describe('with no id', () => {
    test.skip('throws', () => {
      // todo
    });
  });

  describe('with an id', () => {
    test('returns the expected SQL', () => {
      expect(getAtIdQuery(8675309)).toEqual({
        clauses: [
          'SELECT',
          'entities.id, entities.name, entities.domain',
          'FROM entities',
          'WHERE entities.id = ?',
          'LIMIT 1',
        ],
        params: [8675309],
      });
    });
  });
});

describe('getTotalQuery()', () => {
  test('returns the expected SQL', () => {
    expect(getTotalQuery()).toEqual({
      clauses: [
        'SELECT',
        'COUNT(DISTINCT(entities.id)) AS total',
        'FROM entities',
      ],
      params: [],
    });
  });
});
