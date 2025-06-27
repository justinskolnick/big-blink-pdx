const { SORT_DESC, SORT_BY_NAME, SORT_BY_TOTAL } = require('../../../config/constants');

const {
  getAllQuery,
  getAtIdQuery,
  getTotalQuery,
} = require('../people');

describe('getAllQuery()', () => {
  describe('with default options', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery()).toEqual({
        clauses: [
          'SELECT',
          'people.id, people.identical_id, people.pernr, people.type, people.name',
          'FROM people',
          'WHERE',
          'people.identical_id IS NULL',
          'ORDER BY',
          'people.family ASC, people.given ASC',
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
          'people.id, people.identical_id, people.pernr, people.type, people.name',
          'FROM people',
          'WHERE',
          'people.identical_id IS NULL',
          'ORDER BY',
          'people.family ASC, people.given ASC',
        ],
        params: [],
      });
    });

    describe('and perpage', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({ page: 4, perPage: 15 })).toEqual({
          clauses: [
            'SELECT',
            'people.id, people.identical_id, people.pernr, people.type, people.name',
            'FROM people',
            'WHERE',
            'people.identical_id IS NULL',
            'ORDER BY',
            'people.family ASC, people.given ASC',
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
          'people.id, people.identical_id, people.pernr, people.type, people.name',
          'FROM people',
          'LEFT JOIN incident_attendees',
          'ON incident_attendees.person_id = people.id',
          'LEFT JOIN incidents',
          'ON incidents.id = incident_attendees.incident_id',
          'WHERE',
          'people.identical_id IS NULL',
          'AND',
          '(incidents.contact_date BETWEEN ? AND ? OR incidents.contact_date_end BETWEEN ? AND ?)',
          'GROUP BY people.id',
          'ORDER BY',
          'people.family ASC, people.given ASC',
        ],
        params: [
          '2016-04-01',
          '2016-06-30',
          '2016-04-01',
          '2016-06-30',
        ],
      });
    });

    describe('with a role', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({
          dateRangeFrom: '2016-04-01',
          dateRangeTo: '2016-06-30',
          role: 'lobbyist',
        })).toEqual({
          clauses: [
            'SELECT',
            'people.id, people.identical_id, people.pernr, people.type, people.name',
            'FROM people',
            'LEFT JOIN incident_attendees',
            'ON incident_attendees.person_id = people.id',
            'LEFT JOIN incidents',
            'ON incidents.id = incident_attendees.incident_id',
            'WHERE',
            'people.identical_id IS NULL',
            'AND',
            'incident_attendees.role = ?',
            'AND',
            '(incidents.contact_date BETWEEN ? AND ? OR incidents.contact_date_end BETWEEN ? AND ?)',
            'GROUP BY people.id',
            'ORDER BY',
            'people.family ASC, people.given ASC',
          ],
          params: [
            'lobbyist',
            '2016-04-01',
            '2016-06-30',
            '2016-04-01',
            '2016-06-30',
          ],
        });
      });
    });
  });

  describe('with a year', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery({
        year: '2016',
      })).toEqual({
        clauses: [
          'SELECT',
          'people.id, people.identical_id, people.pernr, people.type, people.name',
          'FROM people',
          'LEFT JOIN incident_attendees',
          'ON incident_attendees.person_id = people.id',
          'LEFT JOIN incidents',
          'ON incidents.id = incident_attendees.incident_id',
          'WHERE',
          'people.identical_id IS NULL',
          'AND',
          'SUBSTRING(incidents.contact_date, 1, 4) = ?',
          'GROUP BY people.id',
          'ORDER BY',
          'people.family ASC, people.given ASC',
        ],
        params: ['2016'],
      });
    });

    describe('with a role', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({
          role: 'lobbyist',
          year: '2016',
        })).toEqual({
          clauses: [
            'SELECT',
            'people.id, people.identical_id, people.pernr, people.type, people.name',
            'FROM people',
            'LEFT JOIN incident_attendees',
            'ON incident_attendees.person_id = people.id',
            'LEFT JOIN incidents',
            'ON incidents.id = incident_attendees.incident_id',
            'WHERE',
            'people.identical_id IS NULL',
            'AND',
            'incident_attendees.role = ?',
            'AND',
            'SUBSTRING(incidents.contact_date, 1, 4) = ?',
            'GROUP BY people.id',
            'ORDER BY',
            'people.family ASC, people.given ASC',
          ],
          params: ['lobbyist', '2016'],
        });
      });
    });
  });

  describe('with counts', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery({ includeCount: true })).toEqual({
        clauses: [
          'SELECT',
          'people.id, people.identical_id, people.pernr, people.type, people.name, COUNT(incident_attendees.id) AS total',
          'FROM people',
          'LEFT JOIN incident_attendees',
          'ON incident_attendees.person_id = people.id',
          'WHERE',
          'people.identical_id IS NULL',
          'GROUP BY people.id',
          'ORDER BY',
          'people.family ASC, people.given ASC',
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
              'people.id, people.identical_id, people.pernr, people.type, people.name, COUNT(incident_attendees.id) AS total',
              'FROM people',
              'LEFT JOIN incident_attendees',
              'ON incident_attendees.person_id = people.id',
              'WHERE',
              'people.identical_id IS NULL',
              'GROUP BY people.id',
              'ORDER BY',
              'total DESC, people.family ASC, people.given ASC',
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
              'people.id, people.identical_id, people.pernr, people.type, people.name, COUNT(incident_attendees.id) AS total',
              'FROM people',
              'LEFT JOIN incident_attendees',
              'ON incident_attendees.person_id = people.id',
              'WHERE',
              'people.identical_id IS NULL',
              'GROUP BY people.id',
              'ORDER BY',
              'people.family DESC, people.given DESC',
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
          'people.id, people.identical_id, people.pernr, people.type, people.name, GROUP_CONCAT(distinct incident_attendees.role) AS roles',
          'FROM people',
          'LEFT JOIN incident_attendees ON incident_attendees.person_id = people.id',
          'WHERE people.id = ?',
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
      'SELECT COUNT(people.id) AS total FROM people WHERE people.identical_id IS NULL',
    );
  });
});
