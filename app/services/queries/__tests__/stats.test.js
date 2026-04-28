const {
  getContentTypesQuery,
  getStatsQuery,
} = require('../stats');

describe('getContentTypesQuery()', () => {
  test('with default options', () => {
    expect(getContentTypesQuery()).toEqual({
      clauses: [
        'SELECT',
        'incidents.data_source_id, incidents.contact_type',
        'FROM incidents',
      ],
      params: [],
    });
  });

  test('with an entityId', () => {
    expect(getContentTypesQuery({ entityId: 2023 })).toEqual({
      clauses: [
        'SELECT',
        'incidents.data_source_id, incidents.contact_type',
        'FROM incidents',
        'WHERE',
        'incidents.entity_id = ?',
      ],
      params: [2023],
      id: 2023,
    });
  });

  test('with a personId', () => {
    expect(getContentTypesQuery({ personId: 2023 })).toEqual({
      clauses: [
        'SELECT',
        'incidents.data_source_id, incidents.contact_type',
        'FROM incidents',
        'WHERE',
        'incidents.id IN (SELECT incident_id FROM incident_attendees WHERE person_id = ?)',
      ],
      params: [2023],
      id: 2023,
    });
  });
});

describe('getStatsQuery()', () => {
  test('with default options', () => {
    expect(getStatsQuery()).toEqual({
      clauses: [
        'SELECT',
        'incidents.data_source_id, COUNT(incidents.id) AS total',
        'FROM incidents',
        'GROUP BY incidents.data_source_id',
        'ORDER BY incidents.data_source_id ASC',
      ],
      params: [],
    });
  });

  test('with an entityId', () => {
    expect(getStatsQuery({ entityId: 2023 })).toEqual({
      clauses: [
        'SELECT',
        'incidents.data_source_id, COUNT(incidents.id) AS total',
        'FROM incidents',
        'WHERE',
        'incidents.entity_id = ?',
        'GROUP BY incidents.data_source_id',
        'ORDER BY incidents.data_source_id ASC',
      ],
      params: [2023],
      id: 2023,
    });
  });

  test('with a personId', () => {
    expect(getStatsQuery({ personId: 2023 })).toEqual({
      clauses: [
        'SELECT',
        'incidents.data_source_id, COUNT(incidents.id) AS total',
        'FROM incidents',
        'WHERE',
        'incidents.id IN (SELECT incident_id FROM incident_attendees WHERE person_id = ?)',
        'GROUP BY incidents.data_source_id',
        'ORDER BY incidents.data_source_id ASC',
      ],
      params: [2023],
      id: 2023,
    });
  });
});
