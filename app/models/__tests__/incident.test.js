const Incident = require('../incident');

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
  test('adapts a result', () => {
    expect(Incident.adapt({
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
    })).toEqual({
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
  /* eslint-enable camelcase */

  test('sets data', () => {
    const incident = new Incident({
      x: 'y',
    });

    incident.setData('z', 'abc');
    incident.setData('contact_date', '2025-02-14');

    /* eslint-disable camelcase */
    expect(incident.data).toEqual({
      contact_date: '2025-02-14',
      x: 'y',
      z: 'abc',
    });
    /* eslint-enable camelcase */

    expect(incident.adapted).toEqual({
      category: undefined,
      contactDate: 'February 14, 2025',
      contactType: undefined,
      entity: undefined,
      entityId: undefined,
      entityName: undefined,
      id: undefined,
      lobbyists: undefined,
      notes: undefined,
      officials: undefined,
      raw: {
        lobbyists: undefined,
        officials: undefined,
      },
      sourceId: undefined,
      topic: undefined,
    });
  });
});
