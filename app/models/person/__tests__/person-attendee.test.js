const resultAttendees = require('../__mocks__/result-person-attendees');

const { ROLE_LOBBYIST } = require('../../../config/constants');

const PersonAttendee = require('../person-attendee');

describe('toRoleObject', () => {
  test('returns the expected object', () => {
    expect(PersonAttendee.toRoleObject(ROLE_LOBBYIST, resultAttendees)).toEqual({
      label: 'Associated Names',
      model: 'people',
      type: 'person',
      values: [
        {
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
                  list: [],
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
                  list: [],
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
                  list: [],
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
                  list: [],
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
                  list: [],
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
