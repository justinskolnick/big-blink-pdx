const {
  getQuarterQuery,
} = require('../quarters');

describe('getQuarterQuery()', () => {
  describe('with default options', () => {
    test('returns the expected SQL', () => {
      const options = {};

      expect(getQuarterQuery(options)).toEqual({
        clauses: [
          'SELECT',
          'quarters.id, quarters.year, quarters.quarter, quarters.slug, quarters.date_start, quarters.date_end',
          'FROM quarters',
          'ORDER BY quarters.year ASC, quarters.quarter ASC',
          'LIMIT 1',
        ],
        params: [],
      });
    });
  });

  describe('with a quarter', () => {
    test('returns the expected SQL', () => {
      const options = {
        quarter: 2,
      };

      expect(getQuarterQuery(options)).toEqual({
        clauses: [
          'SELECT',
          'quarters.id, quarters.year, quarters.quarter, quarters.slug, quarters.date_start, quarters.date_end',
          'FROM quarters',
          'WHERE',
          'quarters.quarter = ?',
          'ORDER BY quarters.year ASC, quarters.quarter ASC',
          'LIMIT 1',
        ],
        params: [2],
      });
    });
  });

  describe('with a year', () => {
    test('returns the expected SQL', () => {
      const options = {
        year: 2024,
      };

      expect(getQuarterQuery(options)).toEqual({
        clauses: [
          'SELECT',
          'quarters.id, quarters.year, quarters.quarter, quarters.slug, quarters.date_start, quarters.date_end',
          'FROM quarters',
          'WHERE',
          'quarters.year = ?',
          'ORDER BY quarters.year ASC, quarters.quarter ASC',
          'LIMIT 1',
        ],
        params: [2024],
      });
    });
  });

  describe('with a quarter and a year', () => {
    test('returns the expected SQL', () => {
      const options = {
        quarter: 2,
        year: 2024,
      };

      expect(getQuarterQuery(options)).toEqual({
        clauses: [
          'SELECT',
          'quarters.id, quarters.year, quarters.quarter, quarters.slug, quarters.date_start, quarters.date_end',
          'FROM quarters',
          'WHERE',
          'quarters.quarter = ?',
          'AND',
          'quarters.year = ?',
          'ORDER BY quarters.year ASC, quarters.quarter ASC',
          'LIMIT 1',
        ],
        params: [2, 2024],
      });
    });
  });
});
