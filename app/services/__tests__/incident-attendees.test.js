const {
  getAllQuery,
  getEntitiesQuery,
  getPeopleQuery,
} = require('../incident-attendees');

describe('getAllQuery()', () => {
  describe('with default options', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery()).toEqual({
        clauses: [
          'SELECT',
          'incident_attendees.id,',
          'incident_attendees.appears_as,',
          'incident_attendees.role,',
          'people.id AS person_id,',
          'people.name,',
          'people.type',
          'FROM incident_attendees',
          'LEFT JOIN people ON people.id = incident_attendees.person_id',
          'ORDER BY incident_attendees.role ASC, people.family ASC',
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
          'incident_attendees.id,',
          'incident_attendees.appears_as,',
          'incident_attendees.role,',
          'people.id AS person_id,',
          'people.name,',
          'people.type',
          'FROM incident_attendees',
          'LEFT JOIN people ON people.id = incident_attendees.person_id',
          'WHERE incident_id = ?',
          'ORDER BY incident_attendees.role ASC, people.family ASC',
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
          'incident_attendees.id,',
          'incident_attendees.appears_as,',
          'incident_attendees.role,',
          'people.id AS person_id,',
          'people.name,',
          'people.type',
          'FROM incident_attendees',
          'LEFT JOIN people ON people.id = incident_attendees.person_id',
          'ORDER BY incident_attendees.role ASC, people.family ASC',
        ],
        params: [],
      });
    });

    describe('and perpage', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({ page: 4, perPage: 15 })).toEqual({
          clauses: [
            'SELECT',
            'incident_attendees.id,',
            'incident_attendees.appears_as,',
            'incident_attendees.role,',
            'people.id AS person_id,',
            'people.name,',
            'people.type',
            'FROM incident_attendees',
            'LEFT JOIN people ON people.id = incident_attendees.person_id',
            'ORDER BY incident_attendees.role ASC, people.family ASC',
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
          'LEFT JOIN entities',
          'ON entities.id = incidents.entity_id',
          'ORDER BY entities.name ASC',
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
          'LEFT JOIN entities',
          'ON entities.id = incidents.entity_id',
          'WHERE incidents.id IN',
          '(SELECT incident_id AS id FROM incident_attendees WHERE person_id = ?)',
          'ORDER BY entities.name ASC',
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
            'LEFT JOIN entities',
            'ON entities.id = incidents.entity_id',
            'WHERE incidents.id IN',
            '(SELECT incident_id AS id FROM incident_attendees WHERE person_id = ? AND role = ?)',
            'ORDER BY entities.name ASC',
          ],
          params: [123, 'lobbyist'],
        });
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
          'people.name, incident_attendees.person_id AS id, people.type',
          'FROM incident_attendees',
          'LEFT JOIN people ON people.id = incident_attendees.person_id',
          'ORDER BY incident_attendees.person_id ASC',
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
          'people.name, incident_attendees.person_id AS id, people.type',
          'FROM incident_attendees',
          'LEFT JOIN people ON people.id = incident_attendees.person_id',
          'WHERE incident_attendees.incident_id IN',
          '(SELECT id FROM incidents WHERE entity_id = ?)',
          'ORDER BY incident_attendees.person_id ASC',
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
          'people.name, incident_attendees.person_id AS id, people.type',
          'FROM incident_attendees',
          'LEFT JOIN people ON people.id = incident_attendees.person_id',
          'WHERE incident_attendees.incident_id IN',
          '(SELECT incident_id AS id FROM incident_attendees WHERE person_id = ?)',
          'AND incident_attendees.person_id != ?',
          'ORDER BY incident_attendees.person_id ASC',
        ],
        params: [123, 123],
      });
    });

    describe('and a personRole', () => {
      test('returns the expected SQL', () => {
        expect(getPeopleQuery({ personId: 123, personRole: 'lobbyist' })).toEqual({
          clauses: [
            'SELECT',
            'people.name, incident_attendees.person_id AS id, people.type',
            'FROM incident_attendees',
            'LEFT JOIN people ON people.id = incident_attendees.person_id',
            'WHERE incident_attendees.incident_id IN',
            '(SELECT incident_id AS id FROM incident_attendees WHERE person_id = ? AND role = ?)',
            'AND incident_attendees.person_id != ?',
            'ORDER BY incident_attendees.person_id ASC',
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
          'people.name, incident_attendees.person_id AS id, people.type',
          'FROM incident_attendees',
          'LEFT JOIN people ON people.id = incident_attendees.person_id',
          'AND incident_attendees.role = ?',
          'ORDER BY incident_attendees.person_id ASC',
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
          'people.name, incident_attendees.person_id AS id, people.type',
          'FROM incident_attendees',
          'LEFT JOIN people ON people.id = incident_attendees.person_id',
          'WHERE incident_attendees.incident_id IN',
          '(SELECT id FROM incidents WHERE data_source_id = ?)',
          'ORDER BY incident_attendees.person_id ASC',
        ],
        params: [1],
      });
    });
  });
});
