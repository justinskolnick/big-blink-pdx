const paramHelper = require('../../helpers/param');
const {
  getAllQuery,
  getTotalQuery,
} = require('../incident-attendances');

const { SORT_ASC, SORT_DESC } = paramHelper;

describe('getAllQuery()', () => {
  describe('with default options', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery()).toEqual({
        clauses: [
          'SELECT',
          'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
          'FROM incidents',
          'LEFT JOIN incident_attendees',
          'ON incidents.id = incident_attendees.incident_id',
          'ORDER BY',
          'incidents.contact_date',
          'ASC',
        ],
        params: [],
      });
    });
  });

  describe('with a personId', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery({ personId: 123 })).toEqual({
        clauses: [
          'SELECT',
          'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
          'FROM incidents',
          'LEFT JOIN incident_attendees',
          'ON incidents.id = incident_attendees.incident_id',
          'WHERE',
          'incident_attendees.person_id = ?',
          'ORDER BY',
          'incidents.contact_date',
          'ASC',
        ],
        params: [123],
      });
    });

    describe('and a quarterSourceId', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({ personId: 123, quarterSourceId: 321 })).toEqual({
          clauses: [
          'SELECT',
          'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
          'FROM incidents',
          'LEFT JOIN incident_attendees',
          'ON incidents.id = incident_attendees.incident_id',
          'WHERE',
          'incident_attendees.person_id = ?',
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

    describe('and a withPersonId', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({ personId: 123, withPersonId: 321 })).toEqual({
          clauses: [
          'SELECT',
          'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
          'FROM incidents',
          'LEFT JOIN incident_attendees',
          'ON incidents.id = incident_attendees.incident_id',
          'WHERE',
          'incident_attendees.person_id = ?',
          'AND',
          'incidents.id IN (SELECT incident_attendees.incident_id FROM incident_attendees WHERE incident_attendees.person_id = ? INTERSECT SELECT incident_attendees.incident_id FROM incident_attendees WHERE incident_attendees.person_id = ?)',
          'ORDER BY',
          'incidents.contact_date',
          'ASC',
          ],
          params: [123, 123, 321],
        });
      });
    });

    describe('and a withEntityId', () => {
      test('returns the expected SQL', () => {
        expect(getAllQuery({ personId: 123, withEntityId: 321 })).toEqual({
          clauses: [
          'SELECT',
          'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
          'FROM incidents',
          'LEFT JOIN incident_attendees',
          'ON incidents.id = incident_attendees.incident_id',
          'WHERE',
          'incident_attendees.person_id = ?',
          'AND',
          'incidents.entity_id = ?',
          'ORDER BY',
          'incidents.contact_date',
          'ASC',
          ],
          params: [123, 321],
        });
      });
    });
  });

  describe('with a sort', () => {
    test('returns the expected SQL', () => {
      expect(getAllQuery({ sort: SORT_ASC })).toEqual({
        clauses: [
          'SELECT',
          'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
          'FROM incidents',
          'LEFT JOIN incident_attendees',
          'ON incidents.id = incident_attendees.incident_id',
          'ORDER BY',
          'incidents.contact_date',
          'ASC',
        ],
        params: [],
      });
      expect(getAllQuery({ sort: SORT_DESC })).toEqual({
        clauses: [
          'SELECT',
          'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
          'FROM incidents',
          'LEFT JOIN incident_attendees',
          'ON incidents.id = incident_attendees.incident_id',
          'ORDER BY',
          'incidents.contact_date',
          'DESC',
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
          'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
          'FROM incidents',
          'LEFT JOIN incident_attendees',
          'ON incidents.id = incident_attendees.incident_id',
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
            'incidents.id, incidents.entity, incidents.entity_id, incidents.contact_date, incidents.contact_type, incidents.category, incidents.data_source_id, incidents.topic, incidents.officials, incidents.lobbyists, incidents.notes',
            'FROM incidents',
            'LEFT JOIN incident_attendees',
            'ON incidents.id = incident_attendees.incident_id',
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
});

describe('getTotalQuery()', () => {
  describe('with default options', () => {
    test.skip('throws', () => {
      // todo
    });
  });

  describe('with a personId', () => {
    test('returns the expected SQL', () => {
      expect(getTotalQuery({ personId: 123 })).toEqual({
        clauses: [
          'SELECT',
          'COUNT(incident_attendees.id) AS total',
          'FROM incident_attendees',
          'WHERE',
          'incident_attendees.person_id = ?',
        ],
        params: [123],
      });
    });

    describe('and a withPersonId', () => {
      test('returns the expected SQL', () => {
        expect(getTotalQuery({ personId: 123, withPersonId: 321 })).toEqual({
          clauses: [
            'SELECT',
            'COUNT(id) AS total',
            'FROM ((SELECT incident_id AS id FROM incident_attendees WHERE person_id = ?) INTERSECT (SELECT incident_id AS id FROM incident_attendees WHERE person_id = ?)) AS total',
          ],
          params: [123, 321],
        });
      });
    });

    describe('and a withEntityId', () => {
      test('returns the expected SQL', () => {
        expect(getTotalQuery({ personId: 123, withEntityId: 321 })).toEqual({
          clauses: [
            'SELECT',
            'COUNT(incident_attendees.id) AS total',
            'FROM incident_attendees',
            'LEFT JOIN incidents',
            'ON incidents.id = incident_attendees.incident_id',
            'WHERE',
            'incident_attendees.person_id = ?',
            'AND',
            'incidents.entity_id = ?',
          ],
          params: [123, 321],
        });
      });
    });

    describe('and a quarterSourceId', () => {
      test('returns the expected SQL', () => {
        expect(getTotalQuery({ personId: 123, quarterSourceId: 321 })).toEqual({
          clauses: [
            'SELECT',
            'COUNT(incident_attendees.id) AS total',
            'FROM incident_attendees',
            'LEFT JOIN incidents',
            'ON incidents.id = incident_attendees.incident_id',
            'WHERE',
            'incidents.data_source_id = ?',
            'AND',
            'incident_attendees.person_id = ?',
          ],
          params: [321, 123],
        });
      });
    });
  });
});
