const {
  getStatsQuery,
} = require('../stats');

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
        'WHERE incidents.entity_id = ?',
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
        'WHERE incidents.id IN (SELECT incident_id FROM incident_attendees WHERE person_id = ?)',
        'GROUP BY incidents.data_source_id',
        'ORDER BY incidents.data_source_id ASC',
      ],
      params: [2023],
      id: 2023,
    });
  });
});
