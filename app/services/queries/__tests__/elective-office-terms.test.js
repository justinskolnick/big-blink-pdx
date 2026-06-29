const {
  getAllQuery,
} = require('../elective-office-terms');

describe('getAtPernrQuery()', () => {
  test('returns the expected SQL', () => {
    expect(getAllQuery({ personId: 123456 })).toEqual({
      clauses: [
        'SELECT',
        'elective_office_terms.id, elective_office_terms.duration_years, elective_office_terms.date_start, elective_office_terms.date_end, elective_offices.id, elective_offices.office, elective_offices.district, elective_offices.position',
        'FROM elective_office_terms',
        'LEFT JOIN elective_offices ON elective_office_terms.elective_office_id = elective_offices.id',
        'WHERE',
        'elective_office_terms.person_id = ?',
        'ORDER BY',
        'elective_office_terms.date_start ASC',
      ],
      params: [
        123456,
      ],
    });
  });
});
