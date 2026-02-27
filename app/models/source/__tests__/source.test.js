const resultActivity = require('../__mocks__/result-source-activity');
const resultRegistration = require('../__mocks__/result-source-registration');
const resultPersonnel = require('../__mocks__/result-source-personnel');

const {
  COLLECTION_ATTENDEES,
  COLLECTION_ENTITIES,
  ROLE_ENTITY,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
  ROLE_SOURCE,
} = require('../../../config/constants');

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

describe('isValidRoleOption()', () => {
  test('returns the expected values', () => {
    expect(Source.isValidRoleOption(ROLE_ENTITY)).toBe(false);
    expect(Source.isValidRoleOption(ROLE_LOBBYIST)).toBe(false);
    expect(Source.isValidRoleOption(ROLE_OFFICIAL)).toBe(false);
    expect(Source.isValidRoleOption(ROLE_SOURCE)).toBe(true);
    expect(Source.isValidRoleOption('nada')).toBe(false);
    expect(Source.isValidRoleOption('')).toBe(false);
    expect(Source.isValidRoleOption({})).toBe(false);
    expect(Source.isValidRoleOption(null)).toBe(false);
  });
});

describe('isValidRoleCollection()', () => {
  test('returns the expected values', () => {
    expect(Source.isValidRoleCollection(COLLECTION_ATTENDEES)).toBe(true);
    expect(Source.isValidRoleCollection(COLLECTION_ENTITIES)).toBe(true);
    expect(Source.isValidRoleCollection('nada')).toBe(false);
    expect(Source.isValidRoleCollection('')).toBe(false);
    expect(Source.isValidRoleCollection(null)).toBe(false);
  });
});

describe('adapt()', () => {
  const resultWithTotal = {
    ...resultActivity,
    total: 114,
  };

  test('adapts a result', () => {
    const source = new Source(resultActivity);

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
      roles: {
        label: 'Associations',
        list: [
          'source',
        ],
        options: {
          source: true,
        },
      },
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
      roles: {
        label: 'Associations',
        list: [
          'source',
        ],
        options: {
          source: true,
        },
      },
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
    const source = new Source(resultActivity);
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
      roles: {
        label: 'Associations',
        list: [
          'source',
        ],
        options: {
          source: true,
        },
      },
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
      roles: {
        label: 'Associations',
        list: [
          'source',
        ],
        options: {
          source: true,
        },
      },
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
    const source = new Source(resultActivity);

    test('adapts the result', () => {
      expect(source.adapted).toEqual({
        format: 'csv',
        id: 1,
        publicUrl: 'https://www.portlandoregon.gov/auditor/lobbyist/reports.cfm?action=Reports&reportType=lobbyingActivities&activitiesQtr=1&activitiesYear=2014&submit=View+Report',
        isViaPublicRecords: false,
        quarter: 1,
        retrievedDate: 'March 28, 2023',
        roles: {
          label: 'Associations',
          list: [
            'source',
          ],
          options: {
            source: true,
          },
        },
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
    const source = new Source(resultPersonnel);

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
    const source = new Source(resultRegistration);

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

describe('setRole()', () => {
  let source;

  beforeEach(() => {
    source = new Source();
  });

  afterEach(() => {
    source = null;
  });

  describe('without a role', () => {
    test('returns the expected values', () => {
      expect(source.hasRole()).toBe(false);
      expect(source.role?.role).toBe(undefined);
    });
  });

  describe('with a role', () => {
    describe('with an invalid role', () => {
      beforeEach(() => {
        source.setRole(ROLE_ENTITY);
      });

      test('returns the expected values', () => {
        expect(source.hasRole()).toBe(false);
        expect(source.role?.role).toBe(undefined);
        expect(source.role?.hasCollection(COLLECTION_ATTENDEES)).toBe(undefined);
        expect(source.role?.hasCollection(COLLECTION_ENTITIES)).toBe(undefined);
      });
    });

    describe('with a valid role', () => {
      beforeEach(() => {
        source.setRole(ROLE_SOURCE);
      });

      test('returns the expected values', () => {
        expect(source.hasRole()).toBe(true);
        expect(source.role?.role).toBe(ROLE_SOURCE);
        expect(source.role?.labelPrefix).toBe('source');
        expect(source.role?.hasCollection(COLLECTION_ATTENDEES)).toBe(true);
        expect(source.role?.hasCollection(COLLECTION_ENTITIES)).toBe(true);
      });

      describe('and collection values', () => {
        beforeEach(() => {
          source.role.setCollection(COLLECTION_ATTENDEES, [1, 2, 3]);
          source.role.setCollection(COLLECTION_ENTITIES, [4, 5, 6]);
        });

        test('returns the expected values', () => {
          expect(source.role.getCollection(COLLECTION_ATTENDEES)).toEqual([1, 2, 3]);
          expect(source.role.getCollection(COLLECTION_ENTITIES)).toEqual([4, 5, 6]);
          expect(source.role.toObject()).toEqual({
            attendees: [1, 2, 3],
            entities: [4, 5, 6],
            filterRole: false,
            label: 'For this source',
            role: 'source',
          });
        });
      });
    });
  });
});

describe('setData()', () => {
  test('sets data', () => {
    const source = new Source({
      ...resultActivity,
      total: 114,
      x: 'y',
    });

    source.setData('z', 'abc');
    source.setData('retrieved_at', '2025-02-14 02:19:00');

    expect(source.hasData()).toBe(true);
    expect(source.hasLinks()).toBe(true);

    /* eslint-disable camelcase */
    expect(source.data).toEqual({
      ...resultActivity,
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
      roles: {
        label: 'Associations',
        list: [
          'source',
        ],
        options: {
          source: true,
        },
      },
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
