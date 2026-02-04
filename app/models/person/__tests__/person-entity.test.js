const resultOfficial = require('../__mocks__/result-official');
const resultEntities = require('../__mocks__/result-person-entities');

const { ROLE_OFFICIAL } = require('../../../config/constants');

const Person = require('../person');
const PersonEntity = require('../person-entity');

const record = new Person(resultOfficial);

describe('toRoleObject', () => {
  test('returns the expected object', () => {
    expect(PersonEntity.toRoleObject(ROLE_OFFICIAL, resultEntities, record.adapted)).toEqual({
      label: 'Associated Entities',
      model: 'entities',
      options: [
        'entity',
      ],
      type: 'entity',
      values: [
        {
          association: 'entities',
          label: 'Was lobbied by representatives of these entities',
          records: [
            {
              entity: {
                domain: undefined,
                id: 123,
                links: {
                  self: '/entities/123',
                },
                name: 'ikhslzZsVq1Vz',
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
              },
              lobbyist: {
                id: 987,
                isRegistered: true,
                labels: {
                  statement: 'Registered to lobby on behalf of ikhslzZsVq1Vz for 2021 Q3 – 2023 Q4',
                  title: 'Lobbyist has been registered',
                },
              },
              isRegistered: true,
              registrations: 'Registered to lobby on behalf of ikhslzZsVq1Vz for 2021 Q3 – 2023 Q4',
              total: 83,
            },
            {
              entity: {
                domain: undefined,
                id: 124,
                links: {
                  self: '/entities/124',
                },
                name: 'sIVGOYPh',
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
              },
              lobbyist: {
                id: 987,
                isRegistered: false,
                labels: {
                  statement: 'No record of registration was found',
                  title: 'No record of registration was found',
                },
              },
              isRegistered: false,
              registrations: null,
              total: 16,
            },
            {
              entity: {
                domain: undefined,
                id: 125,
                links: {
                  self: '/entities/125',
                },
                name: 'tH49K0mbUpl3',
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
              },
              lobbyist: {
                id: 987,
                isRegistered: true,
                labels: {
                  statement: 'Registered to lobby on behalf of tH49K0mbUpl3 for 2021 Q1 – 2022 Q2',
                  title: 'Lobbyist has been registered',
                },
              },
              isRegistered: true,
              registrations: 'Registered to lobby on behalf of tH49K0mbUpl3 for 2021 Q1 – 2022 Q2',
              total: 34,
            },
          ],
          role: 'lobbyist',
          total: 3,
        },
      ],
    });
  });
});
