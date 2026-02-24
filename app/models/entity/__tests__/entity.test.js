const {
  COLLECTION_ATTENDEES,
  COLLECTION_ENTITIES,
  ROLE_ENTITY,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../../config/constants');

const Entity = require('../entity');

describe('tableName', () => {
  test('returns the expected tableName', () => {
    expect(Entity.tableName).toBe('entities');
  });
});

describe('getLabel()', () => {
  test('returns the expected labels', () => {
    expect(Entity.getLabel('percentage', 'incidents')).toBe('Share of total');
    expect(Entity.getLabel('total', 'incidents')).toBe('Incident count');
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

describe('primaryKey()', () => {
  test('returns the expected field', () => {
    expect(Entity.primaryKey()).toBe('entities.id');
  });
});

describe('className()', () => {
  test('returns the expected field', () => {
    expect(Entity.className()).toBe('Entity');
  });
});

describe('foreignKey()', () => {
  test('returns the expected field', () => {
    expect(Entity.foreignKey()).toBe('entity_id');
  });
});

describe('isValidRoleOption()', () => {
  test('returns the expected values', () => {
    expect(Entity.isValidRoleOption(ROLE_ENTITY)).toBe(true);
    expect(Entity.isValidRoleOption(ROLE_LOBBYIST)).toBe(false);
    expect(Entity.isValidRoleOption(ROLE_OFFICIAL)).toBe(false);
    expect(Entity.isValidRoleOption('nada')).toBe(false);
    expect(Entity.isValidRoleOption('')).toBe(false);
    expect(Entity.isValidRoleOption({})).toBe(false);
    expect(Entity.isValidRoleOption(null)).toBe(false);
  });
});

describe('isValidRoleCollection()', () => {
  test('returns the expected values', () => {
    expect(Entity.isValidRoleCollection(COLLECTION_ATTENDEES)).toBe(true);
    expect(Entity.isValidRoleCollection(COLLECTION_ENTITIES)).toBe(false);
    expect(Entity.isValidRoleCollection('nada')).toBe(false);
    expect(Entity.isValidRoleCollection('')).toBe(false);
    expect(Entity.isValidRoleCollection(null)).toBe(false);
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
  const resultWithRegistration = {
    ...result,
    isRegistered: true,
  };

  test('adapts a result', () => {
    const entity = new Entity(result);

    expect(entity.adapted).toEqual({
      id: 1,
      name: 'Spacely Sprockets',
      domain: 'https://example.com',
      links: {
        self: '/entities/1'
      },
      roles: {
        label: 'Roles and Associations',
        list: [
          'entity',
        ],
        options: {
          entity: true,
        },
      },
      type: 'entity',
    });
  });

  test('adapts a result with a total', () => {
    const entity = new Entity(resultWithTotal);

    entity.setOverview();

    expect(entity.adapted).toEqual({
      id: 1,
      name: 'Spacely Sprockets',
      domain: 'https://example.com',
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
        self: '/entities/1'
      },
      roles: {
        label: 'Roles and Associations',
        list: [
          'entity',
        ],
        options: {
          entity: true,
        },
      },
      type: 'entity',
    });
  });

  test('adapts a result with a total and a percentage', () => {
    const entity = new Entity(resultWithTotal);

    const incidentCountResult = 246;

    entity.setGlobalIncidentCount(incidentCountResult);
    entity.setOverview();

    expect(entity.adapted).toEqual({
      id: 1,
      name: 'Spacely Sprockets',
      domain: 'https://example.com',
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
        self: '/entities/1'
      },
      roles: {
        label: 'Roles and Associations',
        list: [
          'entity',
        ],
        options: {
          entity: true,
        },
      },
      type: 'entity',
    });
  });

  test('adapts a result with stats', () => {
    const entity = new Entity(result);

    /* eslint-disable camelcase */
    const incident = {
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
    const incidentCountResult = 246;

    const stats = {
      first: incident,
      total: 123,
    };

    entity.setGlobalIncidentCount(incidentCountResult);
    entity.setOverview(stats);

    expect(entity.adapted).toEqual({
      id: 1,
      name: 'Spacely Sprockets',
      domain: 'https://example.com',
      overview: {
        label: 'Overview',
        appearances: {
          label: 'Appearances',
          values: {
            first: {
              key: 'first',
              label: 'First appearance',
              value: {
                /* eslint-disable camelcase */
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
                /* eslint-enable camelcase */
              },
            },
          },
        },
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
        self: '/entities/1'
      },
      roles: {
        label: 'Roles and Associations',
        list: [
          'entity',
        ],
        options: {
          entity: true,
        },
      },
      type: 'entity',
    });
  });

  test('adapts a result with registrations', () => {
    const entity = new Entity(resultWithRegistration);

    expect(entity.adapted).toEqual({
      id: 1,
      name: 'Spacely Sprockets',
      domain: 'https://example.com',
      links: {
        self: '/entities/1'
      },
      registrations: {
        isRegistered: true,
        labels: {
          title: 'Entity has been registered',
        },
      },
      roles: {
        label: 'Roles and Associations',
        list: [
          'entity',
        ],
        options: {
          entity: true,
        },
      },
      type: 'entity',
    });
  });
});

describe('setRole()', () => {
  let entity;

  beforeEach(() => {
    entity = new Entity();
  });

  afterEach(() => {
    entity = null;
  });

  describe('without a role', () => {
    test('returns the expected value', () => {
      expect(entity.hasRole()).toBe(false);
      expect(entity.role?.role).toBe(undefined);
    });
  });

  describe('with a role', () => {
    describe('with an invalid role', () => {
      beforeEach(() => {
        entity.setRole(ROLE_LOBBYIST);
      });

      test('returns the expected value', () => {
        expect(entity.hasRole()).toBe(false);
        expect(entity.role?.role).toBe(undefined);
        expect(entity.role?.hasCollection(COLLECTION_ATTENDEES)).toBe(undefined);
        expect(entity.role?.hasCollection(COLLECTION_ENTITIES)).toBe(undefined);
      });
    });

    describe('with a valid role', () => {
      beforeEach(() => {
        entity.setRole(ROLE_ENTITY);
      });

      test('returns the expected value', () => {
        expect(entity.hasRole()).toBe(true);
        expect(entity.role?.role).toBe(ROLE_ENTITY);
        expect(entity.role?.labelPrefix).toBe('entity');
        expect(entity.role?.hasCollection(COLLECTION_ATTENDEES)).toBe(true);
        expect(entity.role?.hasCollection(COLLECTION_ENTITIES)).toBe(false);
      });

      describe('and collection values', () => {
        beforeEach(() => {
          entity.role.setCollection(COLLECTION_ATTENDEES, [1, 2, 3]);
          entity.role.setCollection(COLLECTION_ENTITIES, [4, 5, 6]);
        });

        test('returns the expected value', () => {
          expect(entity.role.getCollection(COLLECTION_ATTENDEES)).toEqual([1, 2, 3]);
          expect(entity.role.getCollection(COLLECTION_ENTITIES)).toEqual(null);
          expect(entity.role.toObject()).toEqual({
            attendees: [1, 2, 3],
            filterRole: false,
            label: 'As a lobbying entity',
            role: 'entity',
          });
        });
      });
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

    expect(entity.hasData()).toBe(true);
    expect(entity.hasLinks()).toBe(true);

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
      links: {
        self: '/entities/1'
      },
      roles: {
        label: 'Roles and Associations',
        list: [
          'entity',
        ],
        options: {
          entity: true,
        },
      },
      type: 'entity',
    });
  });
});
