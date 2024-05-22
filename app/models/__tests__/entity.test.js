const Entity = require('../entity');

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
    expect(Entity.adapt({
      id: 1,
      name: 'Spacely Sprockets',
      domain: 'https://example.com',
      total: 123,
    })).toEqual({
      id: 1,
      name: 'Spacely Sprockets',
      domain: 'https://example.com',
      incidents: {
        stats: {
          total: 123,
        },
      },
    });
  });
});
