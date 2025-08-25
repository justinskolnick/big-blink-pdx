const {
  getAtPernrQuery,
} = require('../official-positions');

describe('getAtPernrQuery()', () => {
  describe('with a PERNR', () => {
    test('returns the expected SQL', () => {
      expect(getAtPernrQuery(123456)).toEqual({
        clauses: [
          'SELECT',
          'official_positions.pernr, official_positions.name, official_positions.date_start, official_positions.date_end, official_positions.is_withdrawn, official_positions.is_elected, official_positions.office, official_positions.position, official_positions.district, official_positions.responsible_to_pernr, official_positions.area, official_positions.assignment, official_positions.classification, official_positions.rank, official_positions.is_chief, official_positions.role, people.name as personal_name',
          'FROM official_positions',
          'LEFT JOIN people',
          'ON people.pernr = official_positions.pernr',
          'WHERE',
          'official_positions.pernr = ?',
          'GROUP BY',
          'official_positions.pernr, official_positions.name, official_positions.date_start, official_positions.date_end, official_positions.is_withdrawn, official_positions.is_elected, official_positions.office, official_positions.position, official_positions.district, official_positions.responsible_to_pernr, official_positions.area, official_positions.assignment, official_positions.classification, official_positions.rank, official_positions.is_chief, official_positions.role',
          'ORDER BY',
          'official_positions.date_start ASC, official_positions.date_end ASC',
        ],
        params: [
          123456,
        ],
      });
    });

    describe('and a dateOn', () => {
      test('returns the expected SQL', () => {
        expect(getAtPernrQuery(123456, { dateOn: '2025-03-01' })).toEqual({
          clauses: [
            'SELECT',
            'official_positions.pernr, official_positions.name, official_positions.date_start, official_positions.date_end, official_positions.is_withdrawn, official_positions.is_elected, official_positions.office, official_positions.position, official_positions.district, official_positions.responsible_to_pernr, official_positions.area, official_positions.assignment, official_positions.classification, official_positions.rank, official_positions.is_chief, official_positions.role, people.name as personal_name',
            'FROM official_positions',
            'LEFT JOIN people',
            'ON people.pernr = official_positions.pernr',
            'WHERE',
            'official_positions.pernr = ?',
            'AND',
            'date_start <= ? and (date_end is null OR date_end >= ?)',
            'GROUP BY',
            'official_positions.pernr, official_positions.name, official_positions.date_start, official_positions.date_end, official_positions.is_withdrawn, official_positions.is_elected, official_positions.office, official_positions.position, official_positions.district, official_positions.responsible_to_pernr, official_positions.area, official_positions.assignment, official_positions.classification, official_positions.rank, official_positions.is_chief, official_positions.role',
            'ORDER BY',
            'official_positions.date_start ASC, official_positions.date_end ASC',
          ],
          params: [
            123456,
            '2025-03-01',
            '2025-03-01',
          ],
        });
      });
    });
  });
});
