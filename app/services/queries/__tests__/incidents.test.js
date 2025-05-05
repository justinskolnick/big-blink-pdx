const { SORT_ASC, SORT_DESC, SORT_BY_TOTAL } = require('../../../config/constants');

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
          'incidents.contact_date = ?',
          'ORDER BY',
          'incidents.contact_date',
          'ASC',
        ],
        params: ['2019-02-20'],
      });
    });

    describe('and a withPersonId', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({ dateOn: '2019-02-20', withPersonId: 321 })).toEqual({
          clauses: [
            'SELECT',
            'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
            'FROM incidents',
            'LEFT JOIN incident_attendees ON incidents.id = incident_attendees.incident_id',
            'WHERE',
            'incidents.contact_date = ?',
            'AND',
            'incident_attendees.person_id = ?',
            'ORDER BY',
            'incidents.contact_date',
            'ASC',
          ],
          params: ['2019-02-20', 321],
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
          'incidents.contact_date BETWEEN ? AND ?',
          'ORDER BY',
          'incidents.contact_date',
          'ASC',
        ],
        params: ['2019-02-20', '2019-02-28'],
      });
    });

    describe('and a withPersonId', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({ dateRangeFrom: '2019-02-20', dateRangeTo: '2019-02-28', withPersonId: 321 })).toEqual({
          clauses: [
            'SELECT',
            'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_date_end, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
            'FROM incidents',
            'LEFT JOIN incident_attendees ON incidents.id = incident_attendees.incident_id',
            'WHERE',
            'incidents.contact_date BETWEEN ? AND ?',
            'AND',
            'incident_attendees.person_id = ?',
            'ORDER BY',
            'incidents.contact_date',
            'ASC',
          ],
          params: ['2019-02-20', '2019-02-28', 321],
        });
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
            'incidents.contact_date BETWEEN ? AND ?',
            'AND',
            'incidents.data_source_id = ?',
            'ORDER BY',
            'incidents.contact_date',
            'ASC',
          ],
          params: [
            '2019-02-20',
            '2019-02-28',
            123,
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
            'LEFT JOIN incident_attendees ON incidents.id = incident_attendees.incident_id',
            'WHERE',
            'incident_attendees.person_id = ?',
            'AND',
            'incidents.data_source_id = ?',
            'ORDER BY',
            'incidents.contact_date',
            'ASC',
          ],
          params: [321, 123],
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
          'LEFT JOIN incident_attendees ON incidents.id = incident_attendees.incident_id',
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
            'LEFT JOIN incident_attendees ON incidents.id = incident_attendees.incident_id',
            'WHERE',
            'incidents.contact_date BETWEEN ? AND ?',
            'AND',
            'incident_attendees.person_id = ?',
            'ORDER BY',
            'incidents.contact_date',
            'ASC',
          ],
          params: ['2019-02-20', '2019-02-28', 123],
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
            'LEFT JOIN incident_attendees ON incidents.id = incident_attendees.incident_id',
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
            'incidents.contact_date BETWEEN ? AND ?',
            'AND',
            'incidents.entity_id = ?',
            'ORDER BY',
            'incidents.contact_date',
            'ASC',
          ],
          params: ['2019-02-20', '2019-02-28', 123],
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
            'LEFT JOIN incident_attendees ON incidents.id = incident_attendees.incident_id',
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
          'LEFT JOIN entities ON entities.id = incidents.entity_id',
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
          'COUNT(incidents.id) AS total FROM incidents',
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
          'COUNT(incidents.id) AS total FROM incidents',
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
          'COUNT(incidents.id) AS total FROM incidents',
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
            'COUNT(incidents.id) AS total FROM incidents',
            'WHERE',
            'incidents.data_source_id = ?',
            'AND',
            'incidents.entity_id = ?',
          ],
          params: [3, 123],
        });
      });
    });
  });

  describe('with a dateOn', () => {
    test('returns the expected SQL', () => {
      expect(getTotalQuery({ sourceId: 3, dateOn: '2019-02-20' })).toEqual({
        clauses: [
          'SELECT',
          'COUNT(incidents.id) AS total FROM incidents',
          'WHERE',
          'incidents.data_source_id = ?',
          'AND',
          'incidents.contact_date = ?',
        ],
        params: [3, '2019-02-20'],
      });
    });

    describe('and a withEntityId', () => {
      test('returns the expected SQL', () => {
        expect(getTotalQuery({ sourceId: 3, withEntityId: 123, dateOn: '2019-02-20' })).toEqual({
          clauses: [
            'SELECT',
            'COUNT(incidents.id) AS total FROM incidents',
            'WHERE',
            'incidents.data_source_id = ?',
            'AND',
            'incidents.entity_id = ?',
            'AND',
            'incidents.contact_date = ?',
          ],
          params: [3, 123, '2019-02-20'],
        });
      });
    });
  });

  describe('with a date range', () => {
    test('returns the expected SQL', () => {
      expect(getTotalQuery({ sourceId: 3, dateRangeFrom: '2019-02-20', dateRangeTo: '2019-02-28' })).toEqual({
        clauses: [
          'SELECT',
          'COUNT(incidents.id) AS total FROM incidents',
          'WHERE',
          'incidents.data_source_id = ?',
          'AND',
          'incidents.contact_date BETWEEN ? AND ?',
        ],
        params: [3, '2019-02-20', '2019-02-28'],
      });
    });

    describe('and a withEntityId', () => {
      test('returns the expected SQL', () => {
        expect(getTotalQuery({ sourceId: 3, withEntityId: 123, dateRangeFrom: '2019-02-20', dateRangeTo: '2019-02-28' })).toEqual({
          clauses: [
            'SELECT',
            'COUNT(incidents.id) AS total FROM incidents',
            'WHERE',
            'incidents.data_source_id = ?',
            'AND',
            'incidents.entity_id = ?',
            'AND',
            'incidents.contact_date BETWEEN ? AND ?',
          ],
          params: [3, 123, '2019-02-20', '2019-02-28'],
        });
      });
    });
  });

  describe('with a withEntityId', () => {
    test('returns the expected SQL', () => {
      expect(getTotalQuery({ withEntityId: 123 })).toEqual({
        clauses: [
          'SELECT',
          'COUNT(incidents.id) AS total FROM incidents',
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
            'COUNT(incidents.id) AS total FROM incidents',
            'LEFT JOIN incident_attendees ON incidents.id = incident_attendees.incident_id',
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
            'COUNT(incidents.id) AS total FROM incidents',
            'WHERE',
            'incidents.data_source_id = ?',
            'AND',
            'incidents.entity_id = ?',
          ],
          params: [3, 123],
        });
      });
    });
  });
});
