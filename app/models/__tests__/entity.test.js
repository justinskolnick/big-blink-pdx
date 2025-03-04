const Entity = require('../entity');

describe('tableName', () => {
  test('returns the expected tableName', () => {
    expect(Entity.tableName).toBe('entities');
  });
});

describe('getLabel()', () => {
  test('returns the expected labels', () => {
    expect(Entity.getLabel('incident_percentage')).toBe('Share of total');
    expect(Entity.getLabel('incident_total')).toBe('Incident count');
    expect(Entity.getLabel('totals')).toBe('Totals');
  });
});

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(Entity.fields()).toEqual([
      'entities.id',
      'entities.name',
      'entities.domain',
    ]);
  });
});

describe('adapt()', () => {
  const result = {
    id: 1,
    name: 'Spacely Sprockets',
    domain: 'https://example.com',
  };
  const resultWithTotal = {
    ...result,
    total: 123,
  };

  test('adapts a result', () => {
    const entity = new Entity(result);

    expect(entity.adapted).toEqual({
      id: 1,
      name: 'Spacely Sprockets',
      domain: 'https://example.com',
    });
  });

  test('adapts a result with a total', () => {
    const entity = new Entity(resultWithTotal);

    entity.setIncidentStats();

    expect(entity.adapted).toEqual({
      id: 1,
      name: 'Spacely Sprockets',
      domain: 'https://example.com',
      incidents: {
        stats: {
          label: 'Overview',
          totals: {
            label: 'Totals',
            values: {
              total: {
                key: 'total',
                label: 'Incident count',
                value: 123,
              },
            },
          },
        },
      },
    });
  });

  test('adapts a result with a total and a percentage', () => {
    const entity = new Entity(result);
    const entityWithTotal = new Entity(resultWithTotal);

    const incidentCountResult = 246;

    entityWithTotal.setGlobalIncidentCount(incidentCountResult);
    entityWithTotal.setIncidentStats();

    expect(entity.adapted).toEqual({
      id: 1,
      name: 'Spacely Sprockets',
      domain: 'https://example.com',
    });

    expect(entityWithTotal.adapted).toEqual({
      id: 1,
      name: 'Spacely Sprockets',
      domain: 'https://example.com',
      incidents: {
        stats: {
          label: 'Overview',
          totals: {
            label: 'Totals',
            values: {
              percentage: {
                key: 'percentage',
                label: 'Share of total',
                value: '50.00%',
              },
              total: {
                key: 'total',
                label: 'Incident count',
                value: 123,
              },
            },
          },
        },
      },
    });
  });
});

describe('setData()', () => {
  test('sets data', () => {
    const entity = new Entity({
      id: 1,
      name: 'Spacely Sprockets',
      domain: 'https://example.com',
      x: 'y',
    });

    entity.setData('z', 'abc');

    expect(entity.data).toEqual({
      domain: 'https://example.com',
      id: 1,
      name: 'Spacely Sprockets',
      x: 'y',
      z: 'abc',
    });

    expect(entity.adapted).toEqual({
      domain: 'https://example.com',
      id: 1,
      name: 'Spacely Sprockets',
    });
  });
});
