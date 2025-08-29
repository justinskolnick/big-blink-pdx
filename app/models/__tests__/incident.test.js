const Incident = require('../incident');

describe('tableName', () => {
  test('returns the expected tableName', () => {
    expect(Incident.tableName).toBe('incidents');
  });
});

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(Incident.fields()).toEqual([
      'incidents.id',
      'incidents.entity',
      'incidents.entity_id',
      'incidents.contact_date',
      'incidents.contact_date_end',
      'incidents.contact_type',
      'incidents.category',
      'incidents.data_source_id',
      'incidents.topic',
      'incidents.officials',
      'incidents.lobbyists',
      'incidents.notes',
    ]);
  });
});

describe('dateRangeFields()', () => {
  test('returns the expected fields', () => {
    expect(Incident.dateRangeFields()).toEqual([
      'incidents.contact_date',
      'incidents.contact_date_end',
    ]);
  });
});

describe('adapt()', () => {
  /* eslint-disable camelcase */
  const result = {
    id: 6,
    data_source_id: 1,
    entity: 'Spacely Sprockets',
    entity_id: 3,
    contact_date: '2014-01-14',
    contact_date_end: null,
    contact_type: 'Email',
    category: 'Business and Economic Development',
    topic: 'Office Space',
    officials: 'Mayor Mercury; Orbit, Henry',
    lobbyists: 'George Jetson;Rosey the Robot;Miss Rivets',
    notes: 'None',
  };
  /* eslint-enable camelcase */

  test('adapts a result', () => {
    const incident = new Incident(result);

    expect(incident.adapted).toEqual({
      id: 6,
      sourceId: 1,
      entity: 'Spacely Sprockets',
      entityName: 'Spacely Sprockets',
      entityId: 3,
      contactDate: 'January 14, 2014',
      contactDateEnd: null,
      contactDateRange: null,
      contactTypes: [
        'Email',
      ],
      category: 'Business and Economic Development',
      topic: 'Office Space',
      officials: 'Mayor Mercury; Orbit, Henry',
      lobbyists: 'George Jetson;Rosey the Robot;Miss Rivets',
      notes: 'None',
      raw: {
        dateStart: '2014-01-14',
        dateEnd: null,
        officials: 'Mayor Mercury; Orbit, Henry',
        lobbyists: 'George Jetson;Rosey the Robot;Miss Rivets',
      },
      links: {
        self: '/incidents/6',
      },
    });
  });

  describe('with a contact_date_end', () => {
    describe('with the same month as the contact_date', () => {
      test('adapts a result', () => {
        const resultWithContactDateEnd = {
          ...result,
          contact_date_end: '2014-01-16', // eslint-disable-line camelcase
        };

        const incidentWithContactDateEnd = new Incident(resultWithContactDateEnd);

        expect(incidentWithContactDateEnd.adapted).toEqual(expect.objectContaining({
          contactDate: 'January 14, 2014',
          contactDateEnd: 'January 16, 2014',
          contactDateRange: 'January 14 – 16, 2014',
        }));
      });
    });

    describe('with a different month from the contact_date', () => {
      test('adapts a result', () => {
        const resultWithContactDateEnd = {
          ...result,
          contact_date_end: '2014-02-16', // eslint-disable-line camelcase
        };

        const incidentWithContactDateEnd = new Incident(resultWithContactDateEnd);

        expect(incidentWithContactDateEnd.adapted).toEqual(expect.objectContaining({
          contactDate: 'January 14, 2014',
          contactDateEnd: 'February 16, 2014',
          contactDateRange: 'January 14 – February 16, 2014',
        }));
      });
    });

    describe('with a different year from the contact_date', () => {
      test('adapts a result', () => {
        const resultWithContactDateEnd = {
          ...result,
          contact_date: '2014-12-30', // eslint-disable-line camelcase
          contact_date_end: '2015-01-02', // eslint-disable-line camelcase
        };

        const incidentWithContactDateEnd = new Incident(resultWithContactDateEnd);

        expect(incidentWithContactDateEnd.adapted).toEqual(expect.objectContaining({
          contactDate: 'December 30, 2014',
          contactDateEnd: 'January 2, 2015',
          contactDateRange: 'December 30, 2014 – January 2, 2015',
        }));
      });
    });
  });

  describe('with multiple contact types', () => {
    test('adapts a result', () => {
      const resultWithMultipleTypes = {
        ...result,
        contact_type: 'Communication Preparation; Email; Goodwill Building (non-lobbying); Meeting Preparation; Telephone; Virtual Meeting', // eslint-disable-line camelcase
      };

      const incidentWithMultipleTypes = new Incident(resultWithMultipleTypes);

      expect(incidentWithMultipleTypes.adapted).toEqual(expect.objectContaining({
        contactTypes: [
          'Communication Preparation',
          'Email',
          'Goodwill Building (non-lobbying)',
          'Meeting Preparation',
          'Telephone',
          'Virtual Meeting',
        ],
      }));
    });
  });
});

describe('setData()', () => {
  test('sets data', () => {
    /* eslint-disable camelcase */
    const incident = new Incident({
      id: 6,
      data_source_id: 1,
      entity: 'Spacely Sprockets',
      entity_id: 3,
      contact_date: '2014-01-14',
      contact_date_end: null,
      contact_type: 'Email',
      category: 'Business and Economic Development',
      topic: 'Office Space',
      officials: 'Mayor Mercury; Orbit, Henry',
      lobbyists: 'George Jetson;Rosey the Robot;Miss Rivets',
      notes: 'None',
      x: 'y',
    });
    /* eslint-enable camelcase */

    incident.setData('z', 'abc');
    incident.setData('contact_date', '2025-02-14');

    /* eslint-disable camelcase */
    expect(incident.data).toEqual({
      category: 'Business and Economic Development',
      contact_date: '2025-02-14',
      contact_date_end: null,
      contact_type: 'Email',
      data_source_id: 1,
      entity: 'Spacely Sprockets',
      entity_id: 3,
      id: 6,
      lobbyists: 'George Jetson;Rosey the Robot;Miss Rivets',
      notes: 'None',
      officials: 'Mayor Mercury; Orbit, Henry',
      topic: 'Office Space',
      x: 'y',
      z: 'abc',
    });
    /* eslint-enable camelcase */

    expect(incident.adapted).toEqual({
      category: 'Business and Economic Development',
      contactDate: 'February 14, 2025',
      contactDateEnd: null,
      contactDateRange: null,
      contactTypes: [
        'Email',
      ],
      entity: 'Spacely Sprockets',
      entityId: 3,
      entityName: 'Spacely Sprockets',
      id: 6,
      lobbyists: 'George Jetson;Rosey the Robot;Miss Rivets',
      notes: 'None',
      officials: 'Mayor Mercury; Orbit, Henry',
      sourceId: 1,
      topic: 'Office Space',
      raw: {
        dateStart: '2025-02-14',
        dateEnd: null,
        lobbyists: 'George Jetson;Rosey the Robot;Miss Rivets',
        officials: 'Mayor Mercury; Orbit, Henry',
      },
      links: {
        self: '/incidents/6',
      },
    });
  });
});
