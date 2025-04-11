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
      'people.identical_id',
      'people.type',
      'people.name',
    ]);
  });
});

describe('adapt()', () => {
  const result = {
    id: 1,
    identical_id: null, // eslint-disable-line camelcase
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
      identicalId: null,
      type: 'person',
      name: 'John Doe',
      roles: [],
    });
  });

  test('adapts a result with roles', () => {
    const person = new Person(resultWithRoles);

    expect(person.adapted).toEqual({
      id: 1,
      identicalId: null,
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

    person.setOverview();

    expect(person.adapted).toEqual({
      id: 1,
      identicalId: null,
      type: 'person',
      name: 'John Doe',
      roles: [],
      overview: {
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
    });
  });

  test('adapts a result with a total and a percentage', () => {
    const person = new Person(result);
    const personWithTotal = new Person(resultWithTotal);

    const incidentCountResult = 246;

    personWithTotal.setGlobalIncidentCount(incidentCountResult);
    personWithTotal.setOverview();

    expect(person.adapted).toEqual({
      id: 1,
      identicalId: null,
      type: 'person',
      name: 'John Doe',
      roles: [],
    });

    expect(personWithTotal.adapted).toEqual({
      id: 1,
      identicalId: null,
      type: 'person',
      name: 'John Doe',
      roles: [],
      overview: {
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
    });
  });
});

describe('setData()', () => {
  const result = {
    id: 1,
    identical_id: null, // eslint-disable-line camelcase
    type: 'person',
    name: 'John Doe',
  };
  const resultWithJunk = {
    ...result,
    x: 'y',
  };

  test('sets data', () => {
    const person = new Person(resultWithJunk);

    person.setData('z', 'abc');

    expect(person.data).toEqual({
      id: 1,
      identical_id: null, // eslint-disable-line camelcase
      name: 'John Doe',
      type: 'person',
      x: 'y',
      z: 'abc',
    });

    expect(person.adapted).toEqual({
      id: 1,
      identicalId: null,
      name: 'John Doe',
      roles: [],
      type: 'person',
    });
  });
});

describe('hasMoved() and identicalId()', () => {
  const result = {
    id: 3,
    identical_id: null, // eslint-disable-line camelcase
    type: 'person',
    name: 'John Doe',
  };
  const resultWithIdenticalId = {
    ...result,
    identical_id: 1, // eslint-disable-line camelcase
  };

  test('sets data', () => {
    const person1 = new Person(result);
    const person2 = new Person(resultWithIdenticalId);

    expect(person1.hasMoved).toBe(false);
    expect(person2.hasMoved).toBe(true);

    expect(person1.identicalId).toBe(null);
    expect(person2.identicalId).toBe(1);
  });
});
