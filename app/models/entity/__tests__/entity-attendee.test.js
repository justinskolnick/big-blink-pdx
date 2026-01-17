const resultAttendees = require('../__mocks__/result-entity-attendees');

const { ROLE_LOBBYIST } = require('../../../config/constants');

const EntityAttendee = require('../entity-attendee');

describe('getAssociation()', () => {
  test('returns the expected results', () => {
    expect(EntityAttendee.getAssociation('lobbyist')).toEqual('lobbyists');
    expect(EntityAttendee.getAssociation('official')).toEqual('officials');
  });
});

describe('getValueLabelKey()', () => {
  test('returns the expected results', () => {
    expect(EntityAttendee.getValueLabelKey('lobbyist', 'lobbyists')).toEqual('as_entity_lobbyists');
    expect(EntityAttendee.getValueLabelKey('lobbyist', 'officials')).toEqual('as_entity_officials');
    expect(EntityAttendee.getValueLabelKey('official', 'lobbyists')).toEqual('as_entity_lobbyists');
    expect(EntityAttendee.getValueLabelKey('official', 'officials')).toEqual('as_entity_officials');
  });
});

describe('toRoleObject()', () => {
  test('returns the expected object', () => {
    expect(EntityAttendee.toRoleObject(ROLE_LOBBYIST, resultAttendees)).toEqual({
      label: 'Associated Names',
      model: 'people',
      type: 'entity',
      values: [
        {
          association: 'lobbyists',
          label: 'Authorized these lobbyists',
          records: [
            {
              person: {
                id: 123,
                links: {
                  self: '/people/123',
                },
                name: 'Zaida Melchiori',
                pernr: undefined,
                roles: {
                  label: 'Roles and Associations',
                  list: [],
                  options: {},
                },
                type: 'person',
              },
              total: 960,
            },
            {
              person: {
                id: 124,
                links: {
                  self: '/people/124',
                },
                name: 'Lorette Carcieri',
                pernr: undefined,
                roles: {
                  label: 'Roles and Associations',
                  list: [],
                  options: {},
                },
                type: 'person',
              },
              total: 70,
            },
            {
              person: {
                id: 125,
                links: {
                  self: '/people/125',
                },
                name: 'Julio Mari',
                pernr: undefined,
                roles: {
                  label: 'Roles and Associations',
                  list: [],
                  options: {},
                },
                type: 'person',
              },
              total: 340,
            },
          ],
          role: 'lobbyist',
          total: 3,
        },
        {
          association: 'officials',
          label: 'Lobbied these City officials',
          records: [
            {
              person: {
                id: 126,
                links: {
                  self: '/people/126',
                },
                name: 'Burton Eriksen',
                pernr: undefined,
                roles: {
                  label: 'Roles and Associations',
                  list: [],
                  options: {},
                },
                type: 'person',
              },
              total: 720,
            },
            {
              person: {
                id: 127,
                links: {
                  self: '/people/127',
                },
                name: 'Tianna Fosso',
                pernr: undefined,
                roles: {
                  label: 'Roles and Associations',
                  list: [],
                  options: {},
                },
                type: 'person',
              },
              total: 490,
            },
          ],
          role: 'official',
          total: 2,
        },
      ],
    });
  });
});
