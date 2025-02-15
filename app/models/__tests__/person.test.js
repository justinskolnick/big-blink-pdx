const Person = require('../person');

describe('getLabel()', () => {
  test('returns the expected labels', () => {
    expect(Person.getLabel('incident_percentage')).toBe('Share of total');
    expect(Person.getLabel('incident_total')).toBe('Incident count');
    expect(Person.getLabel('totals')).toBe('Totals');
  });
});

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
    const adapted = Person.adapt({
      id: 1,
      type: 'person',
      name: 'John Doe',
      total: 123,
    });

    expect(adapted).toEqual({
      id: 1,
      type: 'person',
      name: 'John Doe',
      roles: [],
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
    const adapted = Person.adapt({
      id: 1,
      type: 'person',
      name: 'John Doe',
    });
    const adaptedWithTotal = Person.adapt({
      id: 1,
      type: 'person',
      name: 'John Doe',
      total: 123,
    });
    const adaptedWithPercentage = Person.appendIncidentsPercentageIfTotal(adapted, 246);
    const adaptedWithTotalAndPercentage = Person.appendIncidentsPercentageIfTotal(adaptedWithTotal, 246);

    expect(adaptedWithPercentage).toEqual({
      id: 1,
      type: 'person',
      name: 'John Doe',
      roles: [],
    });

    expect(adaptedWithTotalAndPercentage).toEqual({
      id: 1,
      type: 'person',
      name: 'John Doe',
      roles: [],
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

  test('sets data', () => {
    const person = new Person({
      x: 'y',
    });

    person.setData('z', 'abc');

    expect(person.data).toEqual({
      x: 'y',
      z: 'abc',
    });

    expect(person.adapted).toEqual({
      id: undefined,
      name: undefined,
      roles: [],
      type: undefined,
    });
  });
});
