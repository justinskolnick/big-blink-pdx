const Person = require('../person');

describe('tableName', () => {
  test('returns the expected tableName', () => {
    expect(Person.tableName).toBe('people');
  });
});

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
  const result = {
    id: 1,
    type: 'person',
    name: 'John Doe',
  };
  const resultWithRoles = {
    ...result,
    roles: 'official,lobbyist',
  };
  const resultWithTotal = {
    ...result,
    total: 123,
  };

  test('adapts a result', () => {
    const person = new Person(result);

    expect(person.adapted).toEqual({
      id: 1,
      type: 'person',
      name: 'John Doe',
      roles: [],
    });
  });

  test('adapts a result with roles', () => {
    const person = new Person(resultWithRoles);

    expect(person.adapted).toEqual({
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
    const person = new Person(resultWithTotal);

    person.setIncidentStats();

    expect(person.adapted).toEqual({
      id: 1,
      type: 'person',
      name: 'John Doe',
      roles: [],
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
    const person = new Person(result);
    const personWithTotal = new Person(resultWithTotal);

    const incidentCountResult = 246;

    personWithTotal.setGlobalIncidentCount(incidentCountResult);
    personWithTotal.setIncidentStats();

    expect(person.adapted).toEqual({
      id: 1,
      type: 'person',
      name: 'John Doe',
      roles: [],
    });

    expect(personWithTotal.adapted).toEqual({
      id: 1,
      type: 'person',
      name: 'John Doe',
      roles: [],
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
    const person = new Person({
      id: 1,
      type: 'person',
      name: 'John Doe',
      x: 'y',
    });

    person.setData('z', 'abc');

    expect(person.data).toEqual({
      id: 1,
      name: 'John Doe',
      type: 'person',
      x: 'y',
      z: 'abc',
    });

    expect(person.adapted).toEqual({
      id: 1,
      name: 'John Doe',
      roles: [],
      type: 'person',
    });
  });
});
