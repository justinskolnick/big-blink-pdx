const resultAttendees = require('../__mocks__/result-person-attendees');

const { ROLE_LOBBYIST } = require('../../../config/constants');

const PersonAttendee = require('../person-attendee');

describe('getAssociation()', () => {
  test('returns the expected results', () => {
    expect(PersonAttendee.getAssociation('lobbyist')).toEqual('lobbyists');
    expect(PersonAttendee.getAssociation('official')).toEqual('officials');
  });
});

describe('getValueLabelKey()', () => {
  test('returns the expected results', () => {
    expect(PersonAttendee.getValueLabelKey('lobbyist', 'lobbyists')).toEqual('as_lobbyist_lobbyists');
    expect(PersonAttendee.getValueLabelKey('lobbyist', 'officials')).toEqual('as_lobbyist_officials');
    expect(PersonAttendee.getValueLabelKey('official', 'lobbyists')).toEqual('as_official_lobbyists');
    expect(PersonAttendee.getValueLabelKey('official', 'officials')).toEqual('as_official_officials');
  });
});

describe('toRoleObject()', () => {
  test('returns the expected object', () => {
    expect(PersonAttendee.toRoleObject(ROLE_LOBBYIST, resultAttendees)).toEqual({
      label: 'Associated People',
      model: 'people',
      options: [
        'lobbyist',
        'official',
      ],
      type: 'person',
      values: [
        {
          association: 'lobbyists',
          label: 'Lobbied alongside these lobbyists',
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
          label: 'Met with these City officials',
          records: [
            {
              person: {
                id: 126,
                links: {
                  self: '/people/126',
                },
                pernr: undefined,
                name: 'Burton Eriksen',
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
                pernr: undefined,
                name: 'Tianna Fosso',
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
