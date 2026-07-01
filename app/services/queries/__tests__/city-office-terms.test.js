const {
  getAllQuery,
} = require('../city-office-terms');

describe('getAtPernrQuery()', () => {
  test('returns the expected SQL', () => {
    expect(getAllQuery({ personId: 123456 })).toEqual({
      clauses: [
        'SELECT',
        'city_office_terms.id, city_office_terms.duration_years, city_office_terms.date_start, city_office_terms.date_end, city_offices.id, city_offices.office, city_offices.district, city_offices.position',
        'FROM city_office_terms',
        'LEFT JOIN city_offices ON city_office_terms.city_office_id = city_offices.id',
        'WHERE',
        'city_office_terms.person_id = ?',
        'ORDER BY',
        'city_office_terms.date_start ASC',
      ],
      params: [
        123456,
      ],
    });
  });
});
