const paramHelper = require('../../helpers/param');
const {
  getAllQuery,
  getAtIdQuery,
  getTotalQuery,
} = require('../entities');

const { SORT_DESC, SORT_BY_NAME, SORT_BY_TOTAL } = paramHelper;

describe('getAllQuery()', () => {
  describe('with default options', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery()).toEqual({
        clauses: [
          'SELECT',
          'entities.id, entities.name',
          'FROM entities',
          'ORDER BY',
          'entities.name ASC',
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
          'entities.id, entities.name',
          'FROM entities',
          'ORDER BY',
          'entities.name ASC',
        ],
        params: [],
      });
    });

    describe('and perpage', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({ page: 4, perPage: 15 })).toEqual({
          clauses: [
            'SELECT',
            'entities.id, entities.name',
            'FROM entities',
            'ORDER BY',
            'entities.name ASC',
            'LIMIT ?,?',
          ],
          params: [45, 15],
        });
      });
    });
  });

  describe('with a limit', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery({ limit: 5 })).toEqual({
        clauses: [
          'SELECT',
          'entities.id, entities.name',
          'FROM entities',
          'ORDER BY',
          'entities.name ASC',
          'LIMIT ?,?',
        ],
        params: [0, 5],
      });
    });
  });

  describe('with counts', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery({ includeCount: true })).toEqual({
        clauses: [
          'SELECT',
          'entities.id, entities.name, COUNT(incidents.id) AS total',
          'FROM entities',
          'LEFT JOIN incidents ON incidents.entity_id = entities.id',
          'GROUP BY entities.id',
          'ORDER BY',
          'entities.name ASC',
        ],
        params: [],
      });
    });

    describe('and sorting', () => {
      describe('with sort_by', () => {
        test('returns the expected SQL', () => {
          expect(getAllQuery({
            includeCount: true,
            sortBy: SORT_BY_TOTAL,
          })).toEqual({
            clauses: [
              'SELECT',
              'entities.id, entities.name, COUNT(incidents.id) AS total',
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
            includeCount: true,
            sort: SORT_DESC,
            sortBy: SORT_BY_NAME,
          })).toEqual({
            clauses: [
              'SELECT',
              'entities.id, entities.name, COUNT(incidents.id) AS total',
              'FROM entities',
              'LEFT JOIN incidents ON incidents.entity_id = entities.id',
              'GROUP BY entities.id',
              'ORDER BY',
              'entities.name DESC',
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
          'entities.id, entities.name',
          'FROM entities',
          'WHERE id = ?',
          'LIMIT 1',
        ],
        params: [8675309],
      });
    });
  });
});

describe('getTotalQuery()', () => {
  test('returns the expected SQL', () => {
    expect(getTotalQuery()).toEqual(
      'SELECT COUNT(id) AS total FROM entities',
    );
  });
});
