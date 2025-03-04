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

describe('adapt()', () => {
  /* eslint-disable camelcase */
  const result = {
    id: 6,
    data_source_id: 1,
    entity: 'Spacely Sprockets',
    entity_id: 3,
    contact_date: '2014-01-14',
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
      contactType: 'Email',
      category: 'Business and Economic Development',
      topic: 'Office Space',
      officials: 'Mayor Mercury; Orbit, Henry',
      lobbyists: 'George Jetson;Rosey the Robot;Miss Rivets',
      notes: 'None',
      raw: {
        officials: 'Mayor Mercury; Orbit, Henry',
        lobbyists: 'George Jetson;Rosey the Robot;Miss Rivets',
      },
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
      contactType: 'Email',
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
        lobbyists: 'George Jetson;Rosey the Robot;Miss Rivets',
        officials: 'Mayor Mercury; Orbit, Henry',
      },
    });
  });
});
