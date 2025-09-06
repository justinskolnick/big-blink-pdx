const {
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
  SORT_ASC,
  SORT_DESC,
  SORT_BY_TOTAL,
} = require('../../../config/constants');

const {
  getAllQuery,
  getAtIdQuery,
  getFirstAndLastDatesQuery,
  getTotalQuery,
} = require('../incidents');

describe('getAllQuery()', () => {
  describe('with default options', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery()).toEqual({
        clauses: [
          'SELECT',
          'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
          'FROM incidents',
          'ORDER BY',
          'incidents.contact_date',
          'ASC',
        ],
        params: [],
      });
    });
  });

  describe('with a dateOn', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery({ dateOn: '2019-02-20' })).toEqual({
        clauses: [
          'SELECT',
          'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
          'FROM incidents',
          'WHERE',
          '(incidents.contact_date = ? OR incidents.contact_date_end = ?)',
          'ORDER BY',
          'incidents.contact_date',
          'ASC',
        ],
        params: ['2019-02-20', '2019-02-20'],
      });
    });

    describe('and a withPersonId', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({ dateOn: '2019-02-20', withPersonId: 321 })).toEqual({
          clauses: [
            'SELECT',
            'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
            'FROM incidents',
            'LEFT JOIN incident_attendees ON incident_attendees.incident_id = incidents.id',
            'WHERE',
            'incident_attendees.person_id = ?',
            'AND',
            '(incidents.contact_date = ? OR incidents.contact_date_end = ?)',
            'ORDER BY',
            'incidents.contact_date',
            'ASC',
          ],
          params: [
            321,
            '2019-02-20',
            '2019-02-20',
          ],
        });
      });
    });
  });

  describe('with a date range', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery({ dateRangeFrom: '2019-02-20', dateRangeTo: '2019-02-28' })).toEqual({
        clauses: [
          'SELECT',
          'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
          'FROM incidents',
          'WHERE',
          '(incidents.contact_date BETWEEN ? AND ? OR incidents.contact_date_end BETWEEN ? AND ?)',
          'ORDER BY',
          'incidents.contact_date',
          'ASC',
        ],
        params: ['2019-02-20', '2019-02-28', '2019-02-20', '2019-02-28'],
      });
    });

    describe('and a withPersonId', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({ dateRangeFrom: '2019-02-20', dateRangeTo: '2019-02-28', withPersonId: 321 })).toEqual({
          clauses: [
            'SELECT',
            'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
            'FROM incidents',
            'LEFT JOIN incident_attendees ON incident_attendees.incident_id = incidents.id',
            'WHERE',
            'incident_attendees.person_id = ?',
            'AND',
            '(incidents.contact_date BETWEEN ? AND ? OR incidents.contact_date_end BETWEEN ? AND ?)',
            'ORDER BY',
            'incidents.contact_date',
            'ASC',
          ],
          params: [
            321,
            '2019-02-20',
            '2019-02-28',
            '2019-02-20',
            '2019-02-28',
          ],
        });
      });
    });
  });

  describe('with a year', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery({ year: '2016' })).toEqual({
        clauses: [
          'SELECT',
          'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
          'FROM incidents',
          'WHERE',
          'SUBSTRING(incidents.contact_date, 1, 4) = ?',
          'ORDER BY',
          'incidents.contact_date',
          'ASC',
        ],
        params: ['2016'],
      });
    });
  });

  describe('with a sourceId', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery({ sourceId: 123 })).toEqual({
        clauses: [
          'SELECT',
          'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
          'FROM incidents',
          'WHERE',
          'incidents.data_source_id = ?',
          'ORDER BY',
          'incidents.contact_date',
          'ASC',
        ],
        params: [123],
      });
    });

    describe('and a date range', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({ sourceId: 123, dateRangeFrom: '2019-02-20', dateRangeTo: '2019-02-28' })).toEqual({
          clauses: [
            'SELECT',
            'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
            'FROM incidents',
            'WHERE',
            'incidents.data_source_id = ?',
            'AND',
            '(incidents.contact_date BETWEEN ? AND ? OR incidents.contact_date_end BETWEEN ? AND ?)',
            'ORDER BY',
            'incidents.contact_date',
            'ASC',
          ],
          params: [
            123,
            '2019-02-20',
            '2019-02-28',
            '2019-02-20',
            '2019-02-28',
          ],
        });
      });
    });

    describe('and a withPersonId', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({ sourceId: 123, withPersonId: 321 })).toEqual({
          clauses: [
            'SELECT',
            'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
            'FROM incidents',
            'LEFT JOIN incident_attendees ON incident_attendees.incident_id = incidents.id',
            'WHERE',
            'incidents.data_source_id = ?',
            'AND',
            'incident_attendees.person_id = ?',
            'ORDER BY',
            'incidents.contact_date',
            'ASC',
          ],
          params: [
            123,
            321,
          ],
        });
      });
    });
  });

  describe('with a personId', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery({ personId: 123 })).toEqual({
        clauses: [
          'SELECT',
          'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
          'FROM incidents',
          'LEFT JOIN incident_attendees ON incident_attendees.incident_id = incidents.id',
          'WHERE',
          'incident_attendees.person_id = ?',
          'ORDER BY',
          'incidents.contact_date',
          'ASC',
        ],
        params: [123],
      });
    });

    describe('and a date range', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({ personId: 123, dateRangeFrom: '2019-02-20', dateRangeTo: '2019-02-28' })).toEqual({
          clauses: [
            'SELECT',
            'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
            'FROM incidents',
            'LEFT JOIN incident_attendees ON incident_attendees.incident_id = incidents.id',
            'WHERE',
            'incident_attendees.person_id = ?',
            'AND',
            '(incidents.contact_date BETWEEN ? AND ? OR incidents.contact_date_end BETWEEN ? AND ?)',
            'ORDER BY',
            'incidents.contact_date',
            'ASC',
          ],
          params: [
            123,
            '2019-02-20',
            '2019-02-28',
            '2019-02-20',
            '2019-02-28',
          ],
        });
      });
    });

    describe('and a role', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({ personId: 123, role: ROLE_OFFICIAL })).toEqual({
          clauses: [
            'SELECT',
            'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
            'FROM incidents',
            'LEFT JOIN incident_attendees ON incident_attendees.incident_id = incidents.id',
            'WHERE',
            'incident_attendees.person_id = ?',
            'AND',
            'incident_attendees.role = ?',
            'ORDER BY',
            'incidents.contact_date',
            'ASC',
          ],
          params: [123, 'official'],
        });
      });
    });

    describe('and a withEntityId', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({ personId: 123, withEntityId: 321 })).toEqual({
          clauses: [
            'SELECT',
            'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
            'FROM incidents',
            'LEFT JOIN incident_attendees ON incident_attendees.incident_id = incidents.id',
            'WHERE',
            'incidents.entity_id = ?',
            'AND',
            'incident_attendees.person_id = ?',
            'ORDER BY',
            'incidents.contact_date',
            'ASC',
          ],
          params: [321, 123],
        });
      });
    });

    describe('and a withPersonId', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({ personId: 123, withPersonId: 321 })).toEqual({
          clauses: [
            'SELECT',
            'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
            'FROM incidents',
            'LEFT JOIN incident_attendees ON incident_attendees.incident_id = incidents.id',
            'WHERE',
            'incident_attendees.person_id = ?',
            'AND',
            'incidents.id IN (SELECT incident_attendees.incident_id FROM incident_attendees WHERE incident_attendees.person_id = ? INTERSECT SELECT incident_attendees.incident_id FROM incident_attendees WHERE incident_attendees.person_id = ?)',
            'GROUP BY',
            'incidents.id',
            'ORDER BY',
            'incidents.contact_date',
            'ASC',
          ],
          params: [
            123,
            123,
            321,
          ],
        });
      });
    });

    describe('and people', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({
          personId: 123,
          people: [
            { id: 321 },
            { id: 456, role: ROLE_OFFICIAL },
            { id: 654, role: ROLE_LOBBYIST },
          ],
        })).toEqual({
          clauses: [
            'SELECT',
            'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
            'FROM incidents',
            'LEFT JOIN incident_attendees ON incident_attendees.incident_id = incidents.id',
            'WHERE',
            'incident_attendees.person_id = ?',
            'AND',
            'incidents.id IN (SELECT incident_attendees.incident_id FROM incident_attendees WHERE incident_attendees.person_id = ? INTERSECT SELECT incident_attendees.incident_id FROM incident_attendees WHERE incident_attendees.person_id = ? INTERSECT SELECT incident_attendees.incident_id FROM incident_attendees WHERE incident_attendees.person_id = ? AND incident_attendees.role = ? INTERSECT SELECT incident_attendees.incident_id FROM incident_attendees WHERE incident_attendees.person_id = ? AND incident_attendees.role = ?)',
            'GROUP BY',
            'incidents.id',
            'ORDER BY',
            'incidents.contact_date',
            'ASC',
          ],
          params: [
            123,
            123,
            321,
            456,
            'official',
            654,
            'lobbyist',
          ],
        });
      });
    });
  });

  describe('with an entityId', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery({ entityId: 123 })).toEqual({
        clauses: [
          'SELECT',
          'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
          'FROM incidents',
          'WHERE',
          'incidents.entity_id = ?',
          'ORDER BY',
          'incidents.contact_date',
          'ASC',
        ],
        params: [123],
      });
    });

    describe('and a date range', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({ entityId: 123, dateRangeFrom: '2019-02-20', dateRangeTo: '2019-02-28' })).toEqual({
          clauses: [
            'SELECT',
            'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
            'FROM incidents',
            'WHERE',
            'incidents.entity_id = ?',
            'AND',
            '(incidents.contact_date BETWEEN ? AND ? OR incidents.contact_date_end BETWEEN ? AND ?)',
            'ORDER BY',
            'incidents.contact_date',
            'ASC',
          ],
          params: [
            123,
            '2019-02-20',
            '2019-02-28',
            '2019-02-20',
            '2019-02-28',
          ],
        });
      });
    });

    describe('and a withPersonId', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({ entityId: 123, withPersonId: 321 })).toEqual({
          clauses: [
            'SELECT',
            'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
            'FROM incidents',
            'LEFT JOIN incident_attendees ON incident_attendees.incident_id = incidents.id',
            'WHERE',
            'incidents.entity_id = ?',
            'AND',
            'incident_attendees.person_id = ?',
            'ORDER BY',
            'incidents.contact_date',
            'ASC',
          ],
          params: [123, 321],
        });
      });
    });

    describe('and a quarterSourceId', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({ entityId: 123, quarterSourceId: 321 })).toEqual({
          clauses: [
            'SELECT',
            'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
            'FROM incidents',
            'WHERE',
            'incidents.entity_id = ?',
            'AND',
            'incidents.data_source_id = ?',
            'ORDER BY',
            'incidents.contact_date',
            'ASC',
          ],
          params: [123, 321],
        });
      });
    });
  });

  describe('with a page number', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery({ page: 4 })).toEqual({
        clauses: [
          'SELECT',
          'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
          'FROM incidents',
          'ORDER BY',
          'incidents.contact_date',
          'ASC',
        ],
        params: [],
      });
    });

    describe('and perpage', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({ page: 4, perPage: 15 })).toEqual({
          clauses: [
            'SELECT',
            'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
            'FROM incidents',
            'ORDER BY',
            'incidents.contact_date',
            'ASC',
            'LIMIT ?,?',
          ],
          params: [45, 15],
        });
      });
    });
  });

  describe('with counts', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery({ includeCount: true })).toEqual({
        clauses: [
          'SELECT',
          'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
          'FROM incidents',
          'ORDER BY',
          'incidents.contact_date',
          'ASC',
        ],
        params: [],
      });
    });

    describe('and a sort column', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({
          includeCount: true,
          sortBy: SORT_BY_TOTAL,
        })).toEqual({
          clauses: [
            'SELECT',
            'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
            'FROM incidents',
            'ORDER BY',
            'incidents.contact_date',
            'ASC',
          ],
          params: [],
        });
      });
    });
  });

  describe('with a sort', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery({ sort: SORT_ASC })).toEqual({
        clauses: [
          'SELECT',
          'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
          'FROM incidents',
          'ORDER BY',
          'incidents.contact_date',
          'ASC',
        ],
        params: [],
      });
      expect(getAllQuery({ sort: SORT_DESC })).toEqual({
        clauses: [
          'SELECT',
          'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
          'FROM incidents',
          'ORDER BY',
          'incidents.contact_date',
          'DESC',
        ],
        params: [],
      });
    });
  });

  describe('with primaryKeyOnly', () => {
    test('returns the expected sql', () => {
      expect(getAllQuery({ primaryKeyOnly: true, entityId: 123 })).toEqual({
        clauses: [
          'SELECT',
          'incidents.id',
          'FROM incidents',
          'WHERE',
          'incidents.entity_id = ?',
        ],
        params: [
          123,
        ],
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
          'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes, entities.name AS entity_name',
          'FROM incidents',
          'LEFT JOIN entities ON incidents.entity_id = entities.id',
          'WHERE incidents.id = ?',
          'LIMIT 1',
        ],
        params: [8675309],
      });
    });
  });
});

describe('getFirstAndLastDatesQuery()', () => {
  // omg

  describe('with default options', () => {
    test('returns the expected SQL', () => {
      expect(getFirstAndLastDatesQuery()).toEqual({
        clauses: [
          '(SELECT incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes FROM incidents LEFT JOIN data_sources ON incidents.data_source_id = data_sources.id WHERE SUBSTRING(incidents.contact_date, 1, 4) = data_sources.year ORDER BY incidents.contact_date ASC LIMIT 1) UNION (SELECT incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes FROM incidents LEFT JOIN data_sources ON incidents.data_source_id = data_sources.id WHERE SUBSTRING(incidents.contact_date, 1, 4) = data_sources.year ORDER BY incidents.contact_date DESC LIMIT 1)',
        ],
        params: [],
      });
    });
  });

  describe('with an entityId', () => {
    test('returns the expected SQL', () => {
      expect(getFirstAndLastDatesQuery({ entityId: 123 })).toEqual({
        clauses: [
          '(SELECT incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes FROM incidents LEFT JOIN data_sources ON incidents.data_source_id = data_sources.id WHERE SUBSTRING(incidents.contact_date, 1, 4) = data_sources.year AND incidents.entity_id = ? ORDER BY incidents.contact_date ASC LIMIT 1) UNION (SELECT incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes FROM incidents LEFT JOIN data_sources ON incidents.data_source_id = data_sources.id WHERE SUBSTRING(incidents.contact_date, 1, 4) = data_sources.year AND incidents.entity_id = ? ORDER BY incidents.contact_date DESC LIMIT 1)',
        ],
        params: [123, 123],
      });
    });
  });

  describe('with a personId', () => {
    test('returns the expected SQL', () => {
      expect(getFirstAndLastDatesQuery({ personId: 123 })).toEqual({
        clauses: [
          '(SELECT incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes FROM incidents LEFT JOIN data_sources ON incidents.data_source_id = data_sources.id LEFT JOIN incident_attendees ON incident_attendees.incident_id = incidents.id WHERE SUBSTRING(incidents.contact_date, 1, 4) = data_sources.year AND incident_attendees.person_id = ? ORDER BY incidents.contact_date ASC LIMIT 1) UNION (SELECT incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes FROM incidents LEFT JOIN data_sources ON incidents.data_source_id = data_sources.id LEFT JOIN incident_attendees ON incident_attendees.incident_id = incidents.id WHERE SUBSTRING(incidents.contact_date, 1, 4) = data_sources.year AND incident_attendees.person_id = ? ORDER BY incidents.contact_date DESC LIMIT 1)',
        ],
        params: [123, 123],
      });
    });
  });

  describe('with a sourceId', () => {
    test('returns the expected SQL', () => {
      expect(getFirstAndLastDatesQuery({ sourceId: 123 })).toEqual({
        clauses: [
          '(SELECT incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes FROM incidents LEFT JOIN data_sources ON incidents.data_source_id = data_sources.id WHERE SUBSTRING(incidents.contact_date, 1, 4) = data_sources.year AND incidents.data_source_id = ? ORDER BY incidents.contact_date ASC LIMIT 1) UNION (SELECT incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes FROM incidents LEFT JOIN data_sources ON incidents.data_source_id = data_sources.id WHERE SUBSTRING(incidents.contact_date, 1, 4) = data_sources.year AND incidents.data_source_id = ? ORDER BY incidents.contact_date DESC LIMIT 1)',
        ],
        params: [123, 123],
      });
    });
  });
});

describe('getTotalQuery()', () => {
  describe('with default options', () => {
    test('returns the expected SQL', () => {
      expect(getTotalQuery()).toEqual({
        clauses: [
          'SELECT',
          'COUNT(incidents.id) AS total',
          'FROM incidents',
        ],
        params: [],
      });
    });
  });

  describe('with an entityId', () => {
    test('returns the expected SQL', () => {
      expect(getTotalQuery({ entityId: 123 })).toEqual({
        clauses: [
          'SELECT',
          'COUNT(incidents.id) AS total',
          'FROM incidents',
          'WHERE',
          'incidents.entity_id = ?',
        ],
        params: [123],
      });
    });
  });

  describe('with a sourceId', () => {
    test('returns the expected SQL', () => {
      expect(getTotalQuery({ sourceId: 3 })).toEqual({
        clauses: [
          'SELECT',
          'COUNT(incidents.id) AS total',
          'FROM incidents',
          'WHERE',
          'incidents.data_source_id = ?',
        ],
        params: [3],
      });
    });

    describe('and a withEntityId', () => {
      test('returns the expected SQL', () => {
        expect(getTotalQuery({ sourceId: 3, withEntityId: 123 })).toEqual({
          clauses: [
            'SELECT',
            'COUNT(incidents.id) AS total',
            'FROM incidents',
            'WHERE',
            'incidents.entity_id = ?',
            'AND',
            'incidents.data_source_id = ?',
          ],
          params: [123, 3],
        });
      });
    });
  });

  describe('with a personId', () => {
    test('returns the expected SQL', () => {
      expect(getTotalQuery({ personId: 3 })).toEqual({
        clauses: [
          'SELECT',
          'COUNT(incidents.id) AS total',
          'FROM incidents',
          'LEFT JOIN incident_attendees ON incident_attendees.incident_id = incidents.id',
          'WHERE',
          'incident_attendees.person_id = ?',
        ],
        params: [3],
      });
    });

    describe('and people', () => {
      test('returns the expected SQL', () => {
        expect(getTotalQuery({
          personId: 123,
          people: [
            { id: 321 },
            { id: 456, role: ROLE_OFFICIAL },
            { id: 654, role: ROLE_LOBBYIST },
          ],
        })).toEqual({
          clauses: [
            'SELECT',
            'COUNT(incidents.id) AS total',
            'FROM incidents',
            'LEFT JOIN incident_attendees ON incident_attendees.incident_id = incidents.id',
            'WHERE',
            'incident_attendees.person_id = ?',
            'AND',
            'incidents.id IN (SELECT incident_attendees.incident_id FROM incident_attendees WHERE incident_attendees.person_id = ? INTERSECT SELECT incident_attendees.incident_id FROM incident_attendees WHERE incident_attendees.person_id = ? INTERSECT SELECT incident_attendees.incident_id FROM incident_attendees WHERE incident_attendees.person_id = ? AND incident_attendees.role = ? INTERSECT SELECT incident_attendees.incident_id FROM incident_attendees WHERE incident_attendees.person_id = ? AND incident_attendees.role = ?)',
          ],
          params: [
            123,
            123,
            321,
            456,
            'official',
            654,
            'lobbyist',
          ],
        });
      });
    });
  });

  describe('with a dateOn', () => {
    test('returns the expected SQL', () => {
      expect(getTotalQuery({ sourceId: 3, dateOn: '2019-02-20' })).toEqual({
        clauses: [
          'SELECT',
          'COUNT(incidents.id) AS total',
          'FROM incidents',
          'WHERE',
          'incidents.data_source_id = ?',
          'AND',
          '(incidents.contact_date = ? OR incidents.contact_date_end = ?)',
        ],
        params: [3, '2019-02-20', '2019-02-20'],
      });
    });

    describe('and an withEntityId', () => {
      test('returns the expected SQL', () => {
        expect(getTotalQuery({ sourceId: 3, withEntityId: 123, dateOn: '2019-02-20' })).toEqual({
          clauses: [
            'SELECT',
            'COUNT(incidents.id) AS total',
            'FROM incidents',
            'WHERE',
            'incidents.entity_id = ?',
            'AND',
            'incidents.data_source_id = ?',
            'AND',
            '(incidents.contact_date = ? OR incidents.contact_date_end = ?)',
          ],
          params: [123, 3, '2019-02-20', '2019-02-20'],
        });
      });
    });
  });

  describe('with a year', () => {
    test('returns the expected SQL', () => {
      expect(getTotalQuery({ year: '2016' })).toEqual({
        clauses: [
          'SELECT',
          'COUNT(incidents.id) AS total',
          'FROM incidents',
          'WHERE',
          'SUBSTRING(incidents.contact_date, 1, 4) = ?',
        ],
        params: ['2016'],
      });
    });
  });

  describe('with a date range', () => {
    test('returns the expected SQL', () => {
      expect(getTotalQuery({ sourceId: 3, dateRangeFrom: '2019-02-20', dateRangeTo: '2019-02-28' })).toEqual({
        clauses: [
          'SELECT',
          'COUNT(incidents.id) AS total',
          'FROM incidents',
          'WHERE',
          'incidents.data_source_id = ?',
          'AND',
          '(incidents.contact_date BETWEEN ? AND ? OR incidents.contact_date_end BETWEEN ? AND ?)',
        ],
        params: [3, '2019-02-20', '2019-02-28', '2019-02-20', '2019-02-28'],
      });
    });

    describe('and an withEntityId', () => {
      test('returns the expected SQL', () => {
        expect(getTotalQuery({ sourceId: 3, withEntityId: 123, dateRangeFrom: '2019-02-20', dateRangeTo: '2019-02-28' })).toEqual({
          clauses: [
            'SELECT',
            'COUNT(incidents.id) AS total',
            'FROM incidents',
            'WHERE',
            'incidents.entity_id = ?',
            'AND',
            'incidents.data_source_id = ?',
            'AND',
            '(incidents.contact_date BETWEEN ? AND ? OR incidents.contact_date_end BETWEEN ? AND ?)',
          ],
          params: [123, 3, '2019-02-20', '2019-02-28', '2019-02-20', '2019-02-28'],
        });
      });
    });
  });

  describe('with an withEntityId', () => {
    test('returns the expected SQL', () => {
      expect(getTotalQuery({ withEntityId: 123 })).toEqual({
        clauses: [
          'SELECT',
          'COUNT(incidents.id) AS total',
          'FROM incidents',
          'WHERE',
          'incidents.entity_id = ?',
        ],
        params: [123],
      });
    });

    describe('and a withPersonId', () => {
      test('returns the expected SQL', () => {
        expect(getTotalQuery({ withEntityId: 123, withPersonId: 321 })).toEqual({
          clauses: [
            'SELECT',
            'COUNT(incidents.id) AS total',
            'FROM incidents',
            'LEFT JOIN incident_attendees ON incident_attendees.incident_id = incidents.id',
            'WHERE',
            'incidents.entity_id = ?',
            'AND',
            'incident_attendees.person_id = ?',
          ],
          params: [123, 321],
        });
      });
    });

    describe('and a quarterSourceId', () => {
      test('returns the expected SQL', () => {
        expect(getTotalQuery({ withEntityId: 123, quarterSourceId: 3 })).toEqual({
          clauses: [
            'SELECT',
            'COUNT(incidents.id) AS total',
            'FROM incidents',
            'WHERE',
            'incidents.entity_id = ?',
            'AND',
            'incidents.data_source_id = ?',
          ],
          params: [123, 3],
        });
      });
    });
  });
});
