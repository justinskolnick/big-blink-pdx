const resultLobbyist = require('../__mocks__/result-lobbyist');
const resultOfficial = require('../__mocks__/result-official');

const Person = require('../person');

describe('tableName', () => {
  test('returns the expected tableName', () => {
    expect(Person.tableName).toBe('people');
  });
});

describe('labelPrefix', () => {
  test('returns the expected labelPrefix', () => {
    expect(Person.labelPrefix).toBe('person');
  });
});

describe('getLabel()', () => {
  test('returns the expected labels', () => {
    expect(Person.getLabel('percentage', 'incidents')).toBe('Share of total');
    expect(Person.getLabel('total', 'incidents')).toBe('Incident count');
    expect(Person.getLabel('totals')).toBe('Totals');
  });
});

describe('fields()', () => {
  test('returns the expected fields', () => {
    expect(Person.fields()).toEqual([
      'people.id',
      'people.identical_id',
      'people.pernr',
      'people.type',
      'people.name',
    ]);
  });
});

describe('primaryKey()', () => {
  test('returns the expected field', () => {
    expect(Person.primaryKey()).toBe('people.id');
  });
});

describe('foreignKey()', () => {
  test('returns the expected field', () => {
    expect(Person.foreignKey()).toBe('person_id');
  });
});

describe('adapt()', () => {
  const resultWithRoles = {
    ...resultLobbyist,
    roles: 'official,lobbyist',
  };
  const resultWithTotal = {
    ...resultLobbyist,
    total: 123,
  };

  test('adapts a result', () => {
    const person = new Person(resultLobbyist);

    expect(person.adapted).toEqual({
      id: 123,
      type: 'person',
      name: 'John Doe',
      pernr: null,
      roles: {
        label: 'Roles and Associations',
        list: [],
        options: {},
      },
      links: {
        self: '/people/123'
      },
    });
  });

  test('adapts a result with a PERNR', () => {
    const person = new Person(resultOfficial);

    expect(person.adapted).toEqual({
      id: 321,
      type: 'person',
      name: 'John Doe',
      pernr: 1020304,
      roles: {
        label: 'Roles and Associations',
        list: [],
        options: {},
      },
      links: {
        self: '/people/321'
      },
    });
  });

  test('adapts a result with roles', () => {
    const person = new Person(resultWithRoles);

    expect(person.adapted).toEqual({
      id: 123,
      type: 'person',
      name: 'John Doe',
      pernr: null,
      roles: {
        label: 'Roles and Associations',
        list: [
          'official',
          'lobbyist',
        ],
        options: {
          lobbyist: true,
          official: true,
        },
      },
      links: {
        self: '/people/123'
      },
    });
  });

  test('adapts a result with a total', () => {
    const person = new Person(resultWithTotal);

    person.setOverview();

    expect(person.adapted).toEqual({
      id: 123,
      type: 'person',
      name: 'John Doe',
      pernr: null,
      roles: {
        label: 'Roles and Associations',
        list: [],
        options: {},
      },
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
      links: {
        self: '/people/123'
      },
    });
  });

  test('adapts a result with a total and a percentage', () => {
    const person = new Person(resultLobbyist);
    const personWithTotal = new Person(resultWithTotal);

    const incidentCountResult = 246;

    personWithTotal.setGlobalIncidentCount(incidentCountResult);
    personWithTotal.setOverview();

    expect(person.adapted).toEqual({
      id: 123,
      type: 'person',
      name: 'John Doe',
      pernr: null,
      roles: {
        label: 'Roles and Associations',
        list: [],
        options: {},
      },
      links: {
        self: '/people/123'
      },
    });

    expect(personWithTotal.adapted).toEqual({
      id: 123,
      type: 'person',
      name: 'John Doe',
      pernr: null,
      roles: {
        label: 'Roles and Associations',
        list: [],
        options: {},
      },
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
      links: {
        self: '/people/123'
      },
    });
  });
});

describe('setData()', () => {
  const resultWithJunk = {
    ...resultOfficial,
    x: 'y',
  };

  test('sets data', () => {
    const person = new Person(resultWithJunk);

    person.setData('z', 'abc');

    expect(person.hasData()).toBe(true);
    expect(person.hasLinks()).toBe(true);

    expect(person.data).toEqual({
      id: 321,
      identical_id: null, // eslint-disable-line camelcase
      name: 'John Doe',
      pernr: 1020304,
      type: 'person',
      x: 'y',
      z: 'abc',
    });

    expect(person.id).toEqual(321);

    expect(person.adapted).toEqual({
      id: 321,
      name: 'John Doe',
      pernr: 1020304,
      roles: {
        label: 'Roles and Associations',
        list: [],
        options: {},
      },
      type: 'person',
      links: {
        self: '/people/321'
      },
    });
  });
});

describe('hasMoved() and identicalId()', () => {
  const resultWithIdenticalId = {
    ...resultLobbyist,
    identical_id: 1, // eslint-disable-line camelcase
  };

  test('returns the expected values', () => {
    const lobbyist = new Person(resultLobbyist);
    const lobbyistDupe = new Person(resultWithIdenticalId);

    expect(lobbyist.hasMoved).toBe(false);
    expect(lobbyistDupe.hasMoved).toBe(true);

    expect(lobbyist.identicalId).toBe(null);
    expect(lobbyistDupe.identicalId).toBe(1);
  });
});

describe('hasPernr() and perner()', () => {
  test('returns the expected values', () => {
    const lobbyist = new Person(resultLobbyist);
    const official = new Person(resultOfficial);

    expect(lobbyist.hasPernr).toBe(false);
    expect(official.hasPernr).toBe(true);

    expect(lobbyist.pernr).toBe(null);
    expect(official.pernr).toBe(1020304);
  });
});
