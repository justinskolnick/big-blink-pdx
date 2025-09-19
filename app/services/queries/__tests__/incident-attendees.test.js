const {
  getAllQuery,
  getEntitiesQuery,
  getEntitiesTotalQuery,
  getHasLobbiedOrBeenLobbiedQuery,
  getPeopleQuery,
  getPeopleTotalQuery,
} = require('../incident-attendees');

describe('getAllQuery()', () => {
  describe('with default options', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery()).toEqual({
        clauses: [
          'SELECT',
          'incident_attendees.id, incident_attendees.appears_as, incident_attendees.role, people.id AS person_id, people.name, people.pernr, people.type',
          'FROM incident_attendees',
          'LEFT JOIN people ON incident_attendees.person_id = people.id',
          'ORDER BY',
          'incident_attendees.role ASC, people.family ASC',
        ],
        params: [],
      });
    });
  });

  describe('with an incidentId', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery({ incidentId: 123 })).toEqual({
        clauses: [
          'SELECT',
          'incident_attendees.id, incident_attendees.appears_as, incident_attendees.role, people.id AS person_id, people.name, people.pernr, people.type',
          'FROM incident_attendees',
          'LEFT JOIN people ON incident_attendees.person_id = people.id',
          'WHERE',
          'incident_attendees.incident_id = ?',
          'ORDER BY',
          'incident_attendees.role ASC, people.family ASC',
        ],
        params: [123],
      });
    });
  });

  describe('with a page number', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery({ page: 4 })).toEqual({
        clauses: [
          'SELECT',
          'incident_attendees.id, incident_attendees.appears_as, incident_attendees.role, people.id AS person_id, people.name, people.pernr, people.type',
          'FROM incident_attendees',
          'LEFT JOIN people ON incident_attendees.person_id = people.id',
          'ORDER BY',
          'incident_attendees.role ASC, people.family ASC',
        ],
        params: [],
      });
    });

    describe('and perpage', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({ page: 4, perPage: 15 })).toEqual({
          clauses: [
            'SELECT',
            'incident_attendees.id, incident_attendees.appears_as, incident_attendees.role, people.id AS person_id, people.name, people.pernr, people.type',
            'FROM incident_attendees',
            'LEFT JOIN people ON incident_attendees.person_id = people.id',
            'ORDER BY',
            'incident_attendees.role ASC, people.family ASC',
            'LIMIT ?,?',
          ],
          params: [45, 15],
        });
      });
    });
  });
});

describe('getEntitiesQuery()', () => {
  describe('with default options', () => {
    test('returns the expected SQL', () => {
      expect(getEntitiesQuery()).toEqual({
        clauses: [
          'SELECT',
          'entities.id, entities.name',
          'FROM incidents',
          'LEFT JOIN entities ON incidents.entity_id = entities.id',
          'ORDER BY',
          'entities.name ASC',
        ],
        params: [],
      });
    });
  });

  describe('with a personId', () => {
    test('returns the expected SQL', () => {
      expect(getEntitiesQuery({ personId: 123 })).toEqual({
        clauses: [
          'SELECT',
          'entities.id, entities.name',
          'FROM incidents',
          'LEFT JOIN entities ON incidents.entity_id = entities.id',
          'WHERE',
          'incidents.id IN (SELECT incident_attendees.incident_id AS id FROM incident_attendees WHERE incident_attendees.person_id = ?)',
          'ORDER BY',
          'entities.name ASC',
        ],
        params: [123],
      });
    });

    describe('and a personRole', () => {
      test('returns the expected SQL', () => {
        expect(getEntitiesQuery({ personId: 123, personRole: 'lobbyist' })).toEqual({
          clauses: [
            'SELECT',
            'entities.id, entities.name',
            'FROM incidents',
            'LEFT JOIN entities ON incidents.entity_id = entities.id',
            'WHERE',
            'incidents.id IN (SELECT incident_attendees.incident_id AS id FROM incident_attendees WHERE incident_attendees.person_id = ? AND incident_attendees.role = ?)',
            'ORDER BY',
            'entities.name ASC',
          ],
          params: [123, 'lobbyist'],
        });
      });
    });
  });
});

describe('getEntitiesTotalQuery()', () => {
  describe('with default options', () => {
    test('returns the expected SQL', () => {
      expect(getEntitiesTotalQuery()).toEqual({
        clauses: [
          'SELECT',
          'COUNT(DISTINCT entities.id) AS total',
          'FROM incidents',
          'LEFT JOIN entities ON incidents.entity_id = entities.id',
        ],
        params: [],
      });
    });
  });

  describe('with a personId', () => {
    test('returns the expected SQL', () => {
      expect(getEntitiesTotalQuery({ personId: 123 })).toEqual({
        clauses: [
          'SELECT',
          'COUNT(DISTINCT entities.id) AS total',
          'FROM incidents',
          'LEFT JOIN entities ON incidents.entity_id = entities.id',
          'WHERE',
          'incidents.id IN (SELECT incident_attendees.incident_id AS id FROM incident_attendees WHERE incident_attendees.person_id = ?)',
        ],
        params: [123],
      });
    });

    describe('and a personRole', () => {
      test('returns the expected SQL', () => {
        expect(getEntitiesTotalQuery({ personId: 123, personRole: 'lobbyist' })).toEqual({
          clauses: [
            'SELECT',
            'COUNT(DISTINCT entities.id) AS total',
            'FROM incidents',
            'LEFT JOIN entities ON incidents.entity_id = entities.id',
            'WHERE',
            'incidents.id IN (SELECT incident_attendees.incident_id AS id FROM incident_attendees WHERE incident_attendees.person_id = ? AND incident_attendees.role = ?)',
          ],
          params: [123, 'lobbyist'],
        });
      });
    });
  });
});

describe('getHasLobbiedOrBeenLobbiedQuery()', () => {
  describe('as a lobbyist', () => {
    test('returns the expected SQL', () => {
      expect(getHasLobbiedOrBeenLobbiedQuery({ personId: 123, role: 'lobbyist' })).toEqual({
        clauses: [
          'SELECT',
          "IF(COUNT(incident_attendees.id) > 0, 'true', 'false') AS hasLobbiedOrBeenLobbied",
          'FROM incident_attendees',
          'WHERE',
          'incident_attendees.role = ? AND incident_attendees.person_id = ?',
        ],
        params: ['lobbyist', 123],
      });
    });
  });

  describe('as an official', () => {
    test('returns the expected SQL', () => {
      expect(getHasLobbiedOrBeenLobbiedQuery({ personId: 123, role: 'official' })).toEqual({
        clauses: [
          'SELECT',
          "IF(COUNT(incident_attendees.id) > 0, 'true', 'false') AS hasLobbiedOrBeenLobbied",
          'FROM incident_attendees',
          'WHERE',
          'incident_attendees.role = ? AND incident_attendees.person_id = ?',
        ],
        params: ['official', 123],
      });
    });
  });
});

describe('getPeopleQuery()', () => {
  describe('with default options', () => {
    test('returns the expected SQL', () => {
      expect(getPeopleQuery()).toEqual({
        clauses: [
          'SELECT',
          'incident_attendees.person_id AS id, people.name, people.type',
          'FROM incident_attendees',
          'LEFT JOIN people ON incident_attendees.person_id = people.id',
          'ORDER BY',
          'incident_attendees.person_id ASC',
        ],
        params: [],
      });
    });
  });

  describe('with an entityId', () => {
    test('returns the expected SQL', () => {
      expect(getPeopleQuery({ entityId: 123 })).toEqual({
        clauses: [
          'SELECT',
          'incident_attendees.person_id AS id, people.name, people.type',
          'FROM incident_attendees',
          'LEFT JOIN people ON incident_attendees.person_id = people.id',
          'WHERE',
          'incident_attendees.incident_id IN (SELECT incidents.id FROM incidents WHERE incidents.entity_id = ?)',
          'ORDER BY',
          'incident_attendees.person_id ASC',
        ],
        params: [123],
      });
    });
  });

  describe('with a personId', () => {
    test('returns the expected SQL', () => {
      expect(getPeopleQuery({ personId: 123 })).toEqual({
        clauses: [
          'SELECT',
          'incident_attendees.person_id AS id, people.name, people.type',
          'FROM incident_attendees',
          'LEFT JOIN people ON incident_attendees.person_id = people.id',
          'WHERE',
          'incident_attendees.incident_id IN (SELECT incident_attendees.incident_id AS id FROM incident_attendees WHERE incident_attendees.person_id = ?)',
          'AND',
          'incident_attendees.person_id != ?',
          'ORDER BY',
          'incident_attendees.person_id ASC',
        ],
        params: [123, 123],
      });
    });

    describe('and a personRole', () => {
      test('returns the expected SQL', () => {
        expect(getPeopleQuery({ personId: 123, personRole: 'lobbyist' })).toEqual({
          clauses: [
            'SELECT',
            'incident_attendees.person_id AS id, people.name, people.type',
            'FROM incident_attendees',
            'LEFT JOIN people ON incident_attendees.person_id = people.id',
            'WHERE',
            'incident_attendees.incident_id IN (SELECT incident_attendees.incident_id AS id FROM incident_attendees WHERE incident_attendees.person_id = ? AND incident_attendees.role = ?)',
            'AND',
            'incident_attendees.person_id != ?',
            'ORDER BY',
            'incident_attendees.person_id ASC',
          ],
          params: [123, 'lobbyist', 123],
        });
      });
    });
  });

  describe('with a role', () => {
    test('returns the expected SQL', () => {
      expect(getPeopleQuery({ role: 'lobbyist' })).toEqual({
        clauses: [
          'SELECT',
          'incident_attendees.person_id AS id, people.name, people.type',
          'FROM incident_attendees',
          'LEFT JOIN people ON incident_attendees.person_id = people.id',
          'WHERE',
          'incident_attendees.role = ?',
          'ORDER BY',
          'incident_attendees.person_id ASC',
        ],
        params: ['lobbyist'],
      });
    });
  });

  describe('with a sourceId', () => {
    test('returns the expected SQL', () => {
      expect(getPeopleQuery({ sourceId: 1 })).toEqual({
        clauses: [
          'SELECT',
          'incident_attendees.person_id AS id, people.name, people.type',
          'FROM incident_attendees',
          'LEFT JOIN people ON incident_attendees.person_id = people.id',
          'WHERE',
          'incident_attendees.incident_id IN (SELECT incidents.id FROM incidents WHERE incidents.data_source_id = ?)',
          'ORDER BY',
          'incident_attendees.person_id ASC',
        ],
        params: [1],
      });
    });
  });
});

describe('getPeopleTotalQuery()', () => {
  describe('with default options', () => {
    test('returns the expected SQL', () => {
      expect(getPeopleTotalQuery()).toEqual({
        clauses: [
          'SELECT',
          'COUNT(DISTINCT incident_attendees.person_id) AS total',
          'FROM incident_attendees',
          'LEFT JOIN people ON incident_attendees.person_id = people.id',
        ],
        params: [],
      });
    });
  });

  describe('with an entityId', () => {
    test('returns the expected SQL', () => {
      expect(getPeopleTotalQuery({ entityId: 123 })).toEqual({
        clauses: [
          'SELECT',
          'COUNT(DISTINCT incident_attendees.person_id) AS total',
          'FROM incident_attendees',
          'LEFT JOIN people ON incident_attendees.person_id = people.id',
          'WHERE',
          'incident_attendees.incident_id IN (SELECT incidents.id FROM incidents WHERE incidents.entity_id = ?)',
        ],
        params: [123],
      });
    });
  });

  describe('with a personId', () => {
    test('returns the expected SQL', () => {
      expect(getPeopleTotalQuery({ personId: 123 })).toEqual({
        clauses: [
          'SELECT',
          'COUNT(DISTINCT incident_attendees.person_id) AS total',
          'FROM incident_attendees',
          'LEFT JOIN people ON incident_attendees.person_id = people.id',
          'WHERE',
          'incident_attendees.incident_id IN (SELECT incident_attendees.incident_id AS id FROM incident_attendees WHERE incident_attendees.person_id = ?)',
          'AND',
          'incident_attendees.person_id != ?',
        ],
        params: [123, 123],
      });
    });

    describe('and a personRole', () => {
      test('returns the expected SQL', () => {
        expect(getPeopleTotalQuery({ personId: 123, personRole: 'lobbyist' })).toEqual({
          clauses: [
            'SELECT',
            'COUNT(DISTINCT incident_attendees.person_id) AS total',
            'FROM incident_attendees',
            'LEFT JOIN people ON incident_attendees.person_id = people.id',
            'WHERE',
            'incident_attendees.incident_id IN (SELECT incident_attendees.incident_id AS id FROM incident_attendees WHERE incident_attendees.person_id = ? AND incident_attendees.role = ?)',
            'AND',
            'incident_attendees.person_id != ?',
          ],
          params: [123, 'lobbyist', 123],
        });
      });
    });
  });

  describe('with a role', () => {
    test('returns the expected SQL', () => {
      expect(getPeopleTotalQuery({ role: 'lobbyist' })).toEqual({
        clauses: [
          'SELECT',
          'COUNT(DISTINCT incident_attendees.person_id) AS total',
          'FROM incident_attendees',
          'LEFT JOIN people ON incident_attendees.person_id = people.id',
          'WHERE',
          'incident_attendees.role = ?',
        ],
        params: ['lobbyist'],
      });
    });
  });

  describe('with a sourceId', () => {
    test('returns the expected SQL', () => {
      expect(getPeopleTotalQuery({ sourceId: 1 })).toEqual({
        clauses: [
          'SELECT',
          'COUNT(DISTINCT incident_attendees.person_id) AS total',
          'FROM incident_attendees',
          'LEFT JOIN people ON incident_attendees.person_id = people.id',
          'WHERE',
          'incident_attendees.incident_id IN (SELECT incidents.id FROM incidents WHERE incidents.data_source_id = ?)',
        ],
        params: [1],
      });
    });
  });
});
