const {
  getAtPernrQuery,
} = require('../official-positions');

describe('getAtPernrQuery()', () => {
  describe('with a PERNR', () => {
    test('returns the expected SQL', () => {
      expect(getAtPernrQuery(123456)).toEqual({
        clauses: [
          'SELECT',
          'official_positions.pernr, official_positions.name, official_positions.date_start, official_positions.date_end, official_positions.is_withdrawn, official_positions.is_elected, official_positions.office, official_positions.position, official_positions.district, official_positions.responsible_to_pernr, official_positions.area, official_positions.assignment, official_positions.classification, official_positions.rank, official_positions.is_chief, official_positions.role',
          'FROM official_positions',
          'WHERE',
          'official_positions.pernr = ?',
        ],
        params: [
          123456,
        ],
      });
    });
  });
});
