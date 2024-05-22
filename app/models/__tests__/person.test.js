const Person = require('../person');

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(Person.fields()).toEqual([
      'people.id',
      'people.type',
      'people.name',
    ]);
  });
});

describe('adapt()', () => {
  test('adapts a result', () => {
    expect(Person.adapt({
      id: 1,
      type: 'person',
      name: 'John Doe',
    })).toEqual({
      id: 1,
      type: 'person',
      name: 'John Doe',
      roles: [],
    });
  });

  test('adapts a result with roles', () => {
    expect(Person.adapt({
      id: 1,
      type: 'person',
      name: 'John Doe',
      roles: 'official,lobbyist',
    })).toEqual({
      id: 1,
      type: 'person',
      name: 'John Doe',
      roles: [
        'official',
        'lobbyist',
      ],
    });
  });

  test('adapts a result with a total', () => {
    expect(Person.adapt({
      id: 1,
      type: 'person',
      name: 'John Doe',
      total: 123,
    })).toEqual({
      id: 1,
      type: 'person',
      name: 'John Doe',
      roles: [],
      incidents: {
        stats: {
          total: 123,
        },
      },
    });
  });
});
