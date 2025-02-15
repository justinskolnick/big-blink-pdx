const Source = require('../source');

describe('getLabel()', () => {
  test('returns the expected labels', () => {
    expect(Source.getLabel('incident_percentage')).toBe('Share of total');
    expect(Source.getLabel('incident_total')).toBe('Incident count');
    expect(Source.getLabel('totals')).toBe('Totals');
  });
});

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(Source.fields()).toEqual([
      'data_sources.id',
      'data_sources.type',
      'data_sources.format',
      'data_sources.title',
      'data_sources.year',
      'data_sources.quarter',
      'data_sources.public_url',
      'data_sources.retrieved_at',
    ]);
  });
});

describe('adapt()', () => {
  /* eslint-disable camelcase */
  test('adapts a result', () => {
    expect(Source.adapt({
      id: 1,
      type: 'activity',
      format: 'csv',
      title: 'Lobbying Activity Report for Q1 2014',
      year: 2014,
      quarter: 1,
      public_url: 'https://www.portlandoregon.gov/auditor/lobbyist/reports.cfm?action=Reports&reportType=lobbyingActivities&activitiesQtr=1&activitiesYear=2014&submit=View+Report',
      retrieved_at: '2023-03-28 02:19:00',
    })).toEqual({
      id: 1,
      type: 'activity',
      format: 'csv',
      title: 'Lobbying Activity Report for Q1 2014',
      year: 2014,
      quarter: 1,
      publicUrl: 'https://www.portlandoregon.gov/auditor/lobbyist/reports.cfm?action=Reports&reportType=lobbyingActivities&activitiesQtr=1&activitiesYear=2014&submit=View+Report',
      retrievedDate: 'March 28, 2023',
    });
  });

  test('adapts a result with a total', () => {
    const adapted = Source.adapt({
      id: 1,
      type: 'activity',
      format: 'csv',
      title: 'Lobbying Activity Report for Q1 2014',
      year: 2014,
      quarter: 1,
      public_url: 'https://www.portlandoregon.gov/auditor/lobbyist/reports.cfm?action=Reports&reportType=lobbyingActivities&activitiesQtr=1&activitiesYear=2014&submit=View+Report',
      retrieved_at: '2023-03-28 02:19:00',
      total: 114,
    });

    expect(adapted).toEqual({
      id: 1,
      type: 'activity',
      format: 'csv',
      title: 'Lobbying Activity Report for Q1 2014',
      year: 2014,
      quarter: 1,
      publicUrl: 'https://www.portlandoregon.gov/auditor/lobbyist/reports.cfm?action=Reports&reportType=lobbyingActivities&activitiesQtr=1&activitiesYear=2014&submit=View+Report',
      retrievedDate: 'March 28, 2023',
      incidents: {
        stats: {
          totals: {
            label: 'Totals',
            values: {
              total: {
                key: 'total',
                label: 'Incident count',
                value: 114,
              },
            },
          },
        },
      },
    });
  });
  /* eslint-enable camelcase */
});

describe('adaptEntity()', () => {
  test('adapts a result', () => {
    expect(Source.adaptEntity({
      id: 1,
      name: 'Spacely Sprockets',
    })).toEqual({
      entity: {
        id: 1,
        name: 'Spacely Sprockets',
      },
    });
  });

  test('adapts a result with a total', () => {
    expect(Source.adaptEntity({
      id: 1,
      name: 'Spacely Sprockets',
      total: 22,
    })).toEqual({
      entity: {
        id: 1,
        name: 'Spacely Sprockets',
      },
      total: 22,
    });
  });

  test('sets data', () => {
    const source = new Source({
      x: 'y',
    });

    source.setData('z', 'abc');
    source.setData('retrieved_at', '2025-02-14');

    /* eslint-disable camelcase */
    expect(source.data).toEqual({
      retrieved_at: '2025-02-14',
      x: 'y',
      z: 'abc',
    });
    /* eslint-enable camelcase */

    expect(source.adapted).toEqual({
      format: undefined,
      id: undefined,
      publicUrl: undefined,
      quarter: undefined,
      retrievedDate: 'February 14, 2025',
      title: undefined,
      type: undefined,
      year: undefined,
    });
  });
});
