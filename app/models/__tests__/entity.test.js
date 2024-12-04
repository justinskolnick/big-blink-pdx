const Entity = require('../entity');

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
  test('adapts a result', () => {
    expect(Entity.adapt({
      id: 1,
      name: 'Spacely Sprockets',
      domain: 'https://example.com',
    })).toEqual({
      id: 1,
      name: 'Spacely Sprockets',
      domain: 'https://example.com',
    });
  });

  test('adapts a result with a total', () => {
    const adapted = Entity.adapt({
      id: 1,
      name: 'Spacely Sprockets',
      domain: 'https://example.com',
      total: 123,
    });

    expect(adapted).toEqual({
      id: 1,
      name: 'Spacely Sprockets',
      domain: 'https://example.com',
      incidents: {
        stats: {
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
    const adapted = Entity.adapt({
      id: 1,
      name: 'Spacely Sprockets',
      domain: 'https://example.com',
    });
    const adaptedWithTotal = Entity.adapt({
      id: 1,
      name: 'Spacely Sprockets',
      domain: 'https://example.com',
      total: 123,
    });
    const adaptedWithPercentage = Entity.appendIncidentsPercentageIfTotal(adapted, 246);
    const adaptedWithTotalAndPercentage = Entity.appendIncidentsPercentageIfTotal(adaptedWithTotal, 246);

    expect(adaptedWithPercentage).toEqual({
      id: 1,
      name: 'Spacely Sprockets',
      domain: 'https://example.com',
    });

    expect(adaptedWithTotalAndPercentage).toEqual({
      id: 1,
      name: 'Spacely Sprockets',
      domain: 'https://example.com',
      incidents: {
        stats: {
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
