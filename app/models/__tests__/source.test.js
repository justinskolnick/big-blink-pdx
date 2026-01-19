const Source = require('../source');

describe('tableName', () => {
  test('returns the expected tableName', () => {
    expect(Source.tableName).toBe('data_sources');
  });
});

describe('getLabel()', () => {
  test('returns the expected labels', () => {
    expect(Source.getLabel('percentage', 'incidents')).toBe('Share of total');
    expect(Source.getLabel('total', 'incidents')).toBe('Incident count');
    expect(Source.getLabel('totals')).toBe('Totals');
    expect(Source.getLabel('activity', 'lobbying')).toBe('Lobbying activity');
    expect(Source.getLabel('registration', 'lobbying')).toBe('Lobbying registration');
    expect(Source.getLabel('first_incident', 'appearances')).toBe('First incident');
    expect(Source.getLabel('last_incident', 'appearances')).toBe('Last incident');

    expect(Source.getLabel('activity_disclaimer', 'source')).toBe('Other than light formatting performed to facilitate database input, indexing to accommodate a modern API, and editing to address obvious typos and improve readability, data from this source remains as downloaded.');
    expect(Source.getLabel('info_linked', 'source', {
      format: 'CSV',
      publicUrl: 'https://foo.bar',
      retrievedDate: 'July 21, 2025',
    })).toBe('Data was retrieved on <strong>July 21, 2025</strong> in <strong>CSV</strong> format from <a href="https://foo.bar" target="_blank" rel="noreferrer">the Portland City Auditor’s Office</a> as published in accordance with the City’s <a href="https://www.portland.gov/what-works-cities/making-data-publicly-accessible" target="_blank" rel="noreferrer">Open Data Policy</a>.');
    expect(Source.getLabel('info_public_records_request', 'source', {
      format: 'Excel',
      retrievedDate: 'July 22, 2025',
    })).toBe('Data was received from the City of Portland on <strong>July 22, 2025</strong> in <strong>Excel</strong> format via public records request.');
    expect(Source.getLabel('personnel_disclaimer', 'source')).toBe('Data has been condensed and edited to facilitate database input, address obvious typos, and improve readability, and some inferences have been made.');
    expect(Source.getLabel('registration_disclaimer', 'source')).toBe('Data has been condensed and edited to facilitate database input, address obvious typos, and improve readability.');
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
      'data_sources.is_via_public_records',
      'data_sources.retrieved_at',
    ]);
  });
});

describe('primaryKey()', () => {
  test('returns the expected field', () => {
    expect(Source.primaryKey()).toBe('data_sources.id');
  });
});

describe('className()', () => {
  test('returns the expected field', () => {
    expect(Source.className()).toBe('Source');
  });
});

describe('foreignKey()', () => {
  test('returns the expected field', () => {
    expect(Source.foreignKey()).toBe('data_source_id');
  });
});

describe('adapt()', () => {
  /* eslint-disable camelcase */
  const result = {
    id: 1,
    type: 'activity',
    format: 'csv',
    title: 'Lobbying Activity Report for Q1 2014',
    year: 2014,
    quarter: 1,
    public_url: 'https://www.portlandoregon.gov/auditor/lobbyist/reports.cfm?action=Reports&reportType=lobbyingActivities&activitiesQtr=1&activitiesYear=2014&submit=View+Report',
      is_via_public_records: false,
    retrieved_at: '2023-03-28 02:19:00',
  };
  const resultWithTotal = {
    ...result,
    total: 114,
  };
  /* eslint-enable camelcase */

  test('adapts a result', () => {
    const source = new Source(result);

    expect(source.adapted).toEqual({
      id: 1,
      type: 'activity',
      format: 'csv',
      title: 'Lobbying Activity Report for Q1 2014',
      year: 2014,
      quarter: 1,
      publicUrl: 'https://www.portlandoregon.gov/auditor/lobbyist/reports.cfm?action=Reports&reportType=lobbyingActivities&activitiesQtr=1&activitiesYear=2014&submit=View+Report',
      isViaPublicRecords: false,
      retrievedDate: 'March 28, 2023',
      labels: {
        disclaimer: 'Data was retrieved on <strong>March 28, 2023</strong> in <strong>CSV</strong> format from <a href="https://www.portlandoregon.gov/auditor/lobbyist/reports.cfm?action=Reports&reportType=lobbyingActivities&activitiesQtr=1&activitiesYear=2014&submit=View+Report" target="_blank" rel="noreferrer">the Portland City Auditor’s Office</a> as published in accordance with the City’s <a href="https://www.portland.gov/what-works-cities/making-data-publicly-accessible" target="_blank" rel="noreferrer">Open Data Policy</a>. Other than light formatting performed to facilitate database input, indexing to accommodate a modern API, and editing to address obvious typos and improve readability, data from this source remains as downloaded.',
      },
      links: {
        self: '/sources/1'
      },
    });
  });

  test('adapts a result with a total', () => {
    const source = new Source(resultWithTotal);

    source.setOverview();

    expect(source.adapted).toEqual({
      id: 1,
      type: 'activity',
      format: 'csv',
      title: 'Lobbying Activity Report for Q1 2014',
      year: 2014,
      quarter: 1,
      publicUrl: 'https://www.portlandoregon.gov/auditor/lobbyist/reports.cfm?action=Reports&reportType=lobbyingActivities&activitiesQtr=1&activitiesYear=2014&submit=View+Report',
      isViaPublicRecords: false,
      retrievedDate: 'March 28, 2023',
      labels: {
        disclaimer: 'Data was retrieved on <strong>March 28, 2023</strong> in <strong>CSV</strong> format from <a href="https://www.portlandoregon.gov/auditor/lobbyist/reports.cfm?action=Reports&reportType=lobbyingActivities&activitiesQtr=1&activitiesYear=2014&submit=View+Report" target="_blank" rel="noreferrer">the Portland City Auditor’s Office</a> as published in accordance with the City’s <a href="https://www.portland.gov/what-works-cities/making-data-publicly-accessible" target="_blank" rel="noreferrer">Open Data Policy</a>. Other than light formatting performed to facilitate database input, indexing to accommodate a modern API, and editing to address obvious typos and improve readability, data from this source remains as downloaded.',
      },
      links: {
        self: '/sources/1'
      },
      overview: {
        label: 'Overview',
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
    });
  });

  test('adapts a result with a total and a percentage', () => {
    const source = new Source(result);
    const sourceWithTotal = new Source(resultWithTotal);

    const incidentCountResult = 246;

    sourceWithTotal.setGlobalIncidentCount(incidentCountResult);
    sourceWithTotal.setOverview();

    expect(source.adapted).toEqual({
      id: 1,
      type: 'activity',
      format: 'csv',
      title: 'Lobbying Activity Report for Q1 2014',
      year: 2014,
      quarter: 1,
      publicUrl: 'https://www.portlandoregon.gov/auditor/lobbyist/reports.cfm?action=Reports&reportType=lobbyingActivities&activitiesQtr=1&activitiesYear=2014&submit=View+Report',
      isViaPublicRecords: false,
      retrievedDate: 'March 28, 2023',
      labels: {
        disclaimer: 'Data was retrieved on <strong>March 28, 2023</strong> in <strong>CSV</strong> format from <a href="https://www.portlandoregon.gov/auditor/lobbyist/reports.cfm?action=Reports&reportType=lobbyingActivities&activitiesQtr=1&activitiesYear=2014&submit=View+Report" target="_blank" rel="noreferrer">the Portland City Auditor’s Office</a> as published in accordance with the City’s <a href="https://www.portland.gov/what-works-cities/making-data-publicly-accessible" target="_blank" rel="noreferrer">Open Data Policy</a>. Other than light formatting performed to facilitate database input, indexing to accommodate a modern API, and editing to address obvious typos and improve readability, data from this source remains as downloaded.',
      },
      links: {
        self: '/sources/1'
      },
    });

    expect(sourceWithTotal.adapted).toEqual({
      id: 1,
      type: 'activity',
      format: 'csv',
      title: 'Lobbying Activity Report for Q1 2014',
      year: 2014,
      quarter: 1,
      publicUrl: 'https://www.portlandoregon.gov/auditor/lobbyist/reports.cfm?action=Reports&reportType=lobbyingActivities&activitiesQtr=1&activitiesYear=2014&submit=View+Report',
      isViaPublicRecords: false,
      retrievedDate: 'March 28, 2023',
      labels: {
        disclaimer: 'Data was retrieved on <strong>March 28, 2023</strong> in <strong>CSV</strong> format from <a href="https://www.portlandoregon.gov/auditor/lobbyist/reports.cfm?action=Reports&reportType=lobbyingActivities&activitiesQtr=1&activitiesYear=2014&submit=View+Report" target="_blank" rel="noreferrer">the Portland City Auditor’s Office</a> as published in accordance with the City’s <a href="https://www.portland.gov/what-works-cities/making-data-publicly-accessible" target="_blank" rel="noreferrer">Open Data Policy</a>. Other than light formatting performed to facilitate database input, indexing to accommodate a modern API, and editing to address obvious typos and improve readability, data from this source remains as downloaded.',
      },
      links: {
        self: '/sources/1'
      },
      overview: {
        label: 'Overview',
        totals: {
          label: 'Totals',
          values: {
            percentage: {
              key: 'percentage',
              label: 'Share of total',
              value: '46.34%',
            },
            total: {
              key: 'total',
              label: 'Incident count',
              value: 114,
            },
          },
        },
      },
    });
  });
});

describe('adaptDisclaimer()', () => {
  describe('with an activity source', () => {
    /* eslint-disable camelcase */
    const result = {
      id: 1,
      type: 'activity',
      format: 'csv',
      title: 'Lobbying Activity Report for Q1 2014',
      year: 2014,
      quarter: 1,
      public_url: 'https://www.portlandoregon.gov/auditor/lobbyist/reports.cfm?action=Reports&reportType=lobbyingActivities&activitiesQtr=1&activitiesYear=2014&submit=View+Report',
      is_via_public_records: false,
      retrieved_at: '2023-03-28 02:19:00',
    };
    /* eslint-enable camelcase */

    const source = new Source(result);

    test('adapts the result', () => {
      expect(source.adapted).toEqual({
        format: 'csv',
        id: 1,
        publicUrl: 'https://www.portlandoregon.gov/auditor/lobbyist/reports.cfm?action=Reports&reportType=lobbyingActivities&activitiesQtr=1&activitiesYear=2014&submit=View+Report',
        isViaPublicRecords: false,
        quarter: 1,
        retrievedDate: 'March 28, 2023',
        title: 'Lobbying Activity Report for Q1 2014',
        type: 'activity',
        year: 2014,
        labels: {
          disclaimer: 'Data was retrieved on <strong>March 28, 2023</strong> in <strong>CSV</strong> format from <a href="https://www.portlandoregon.gov/auditor/lobbyist/reports.cfm?action=Reports&reportType=lobbyingActivities&activitiesQtr=1&activitiesYear=2014&submit=View+Report" target="_blank" rel="noreferrer">the Portland City Auditor’s Office</a> as published in accordance with the City’s <a href="https://www.portland.gov/what-works-cities/making-data-publicly-accessible" target="_blank" rel="noreferrer">Open Data Policy</a>. Other than light formatting performed to facilitate database input, indexing to accommodate a modern API, and editing to address obvious typos and improve readability, data from this source remains as downloaded.',
        },
        links: {
          self: '/sources/1',
        },
      });
    });
  });

  describe('with a personnel source', () => {
    /* eslint-disable camelcase */
    const result = {
      id: 1,
      type: 'personnel',
      format: 'excel',
      title: 'Personnel List',
      year: null,
      quarter: null,
      public_url: null,
      is_via_public_records: 1,
      retrieved_at: '2025-06-18 02:19:00',
    };
    /* eslint-enable camelcase */

    const source = new Source(result);

    test('adapts the result', () => {
      expect(source.adapted).toEqual({
        format: 'excel',
        id: 1,
        publicUrl: null,
        isViaPublicRecords: true,
        quarter: null,
        retrievedDate: 'June 18, 2025',
        title: 'Personnel List',
        type: 'personnel',
        year: null,
        labels: {
          disclaimer: 'Data was received from the City of Portland on <strong>June 18, 2025</strong> in <strong>Excel</strong> format via public records request. Data has been condensed and edited to facilitate database input, address obvious typos, and improve readability, and some inferences have been made.',
        },
        links: {
          self: '/sources/1',
        },
      });
    });
  });

  describe('with a registration source', () => {
    /* eslint-disable camelcase */
    const result = {
      id: 1,
      type: 'registration',
      format: 'csv',
      title: 'Lobbying Registration Report for Q1 2014',
      year: 2014,
      quarter: 1,
      public_url: 'https://www.portlandoregon.gov/auditor/lobbyist/reports.cfm?action=Reports&reportType=registration&registrationQtr=1&registrationYear=2014&submit=View%20Report',
      is_via_public_records: false,
      retrieved_at: '2023-06-26 02:19:00',
    };
    /* eslint-enable camelcase */

    const source = new Source(result);

    test('adapts the result', () => {
      expect(source.adapted).toEqual({
        format: 'csv',
        id: 1,
        publicUrl: 'https://www.portlandoregon.gov/auditor/lobbyist/reports.cfm?action=Reports&reportType=registration&registrationQtr=1&registrationYear=2014&submit=View%20Report',
        isViaPublicRecords: false,
        quarter: 1,
        retrievedDate: 'June 26, 2023',
        title: 'Lobbying Registration Report for Q1 2014',
        type: 'registration',
        year: 2014,
        labels: {
          disclaimer: 'Data was retrieved on <strong>June 26, 2023</strong> in <strong>CSV</strong> format from <a href="https://www.portlandoregon.gov/auditor/lobbyist/reports.cfm?action=Reports&reportType=registration&registrationQtr=1&registrationYear=2014&submit=View%20Report" target="_blank" rel="noreferrer">the Portland City Auditor’s Office</a> as published in accordance with the City’s <a href="https://www.portland.gov/what-works-cities/making-data-publicly-accessible" target="_blank" rel="noreferrer">Open Data Policy</a>. Data has been condensed and edited to facilitate database input, address obvious typos, and improve readability.',
        },
        links: {
          self: '/sources/1',
        },
      });
    });
  });
});

describe('adaptEntity()', () => {
  test('adapts an entity result', () => {
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

  test('adapts an entity result with a total', () => {
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
});

describe('setData()', () => {
  test('sets data', () => {
    /* eslint-disable camelcase */
    const source = new Source({
      id: 1,
      type: 'activity',
      format: 'csv',
      title: 'Lobbying Activity Report for Q1 2014',
      year: 2014,
      quarter: 1,
      public_url: 'https://www.portlandoregon.gov/auditor/lobbyist/reports.cfm?action=Reports&reportType=lobbyingActivities&activitiesQtr=1&activitiesYear=2014&submit=View+Report',
      is_via_public_records: false,
      retrieved_at: '2023-03-28 02:19:00',
      total: 114,
      x: 'y',
    });
    /* eslint-enable camelcase */

    source.setData('z', 'abc');
    source.setData('retrieved_at', '2025-02-14 02:19:00');

    expect(source.hasData()).toBe(true);
    expect(source.hasLinks()).toBe(true);

    /* eslint-disable camelcase */
    expect(source.data).toEqual({
      id: 1,
      type: 'activity',
      format: 'csv',
      title: 'Lobbying Activity Report for Q1 2014',
      year: 2014,
      quarter: 1,
      public_url: 'https://www.portlandoregon.gov/auditor/lobbyist/reports.cfm?action=Reports&reportType=lobbyingActivities&activitiesQtr=1&activitiesYear=2014&submit=View+Report',
      is_via_public_records: false,
      retrieved_at: '2025-02-14 02:19:00',
      total: 114,
      x: 'y',
      z: 'abc',
    });
    /* eslint-enable camelcase */

    expect(source.adapted).toEqual({
      format: 'csv',
      id: 1,
      publicUrl: 'https://www.portlandoregon.gov/auditor/lobbyist/reports.cfm?action=Reports&reportType=lobbyingActivities&activitiesQtr=1&activitiesYear=2014&submit=View+Report',
      isViaPublicRecords: false,
      quarter: 1,
      retrievedDate: 'February 14, 2025',
      title: 'Lobbying Activity Report for Q1 2014',
      type: 'activity',
      year: 2014,
      labels: {
        disclaimer: 'Data was retrieved on <strong>February 14, 2025</strong> in <strong>CSV</strong> format from <a href="https://www.portlandoregon.gov/auditor/lobbyist/reports.cfm?action=Reports&reportType=lobbyingActivities&activitiesQtr=1&activitiesYear=2014&submit=View+Report" target="_blank" rel="noreferrer">the Portland City Auditor’s Office</a> as published in accordance with the City’s <a href="https://www.portland.gov/what-works-cities/making-data-publicly-accessible" target="_blank" rel="noreferrer">Open Data Policy</a>. Other than light formatting performed to facilitate database input, indexing to accommodate a modern API, and editing to address obvious typos and improve readability, data from this source remains as downloaded.',
      },
      links: {
        self: '/sources/1'
      },
    });
  });
});
