const resultSource = require('../__mocks__/result-source-activity');
const resultEntities = require('../__mocks__/result-source-entities');

const { ROLE_SOURCE } = require('../../../config/constants');

const Source = require('../source');
const SourceEntity = require('../source-entity');

const record = new Source(resultSource);

describe('toRoleObject', () => {
  test('returns the expected object', () => {
    expect(SourceEntity.toRoleObject(ROLE_SOURCE, resultEntities, record.adapted)).toEqual({
      label: 'Associated Entities',
      model: 'entities',
      options: [
        'entity',
      ],
      type: 'entity',
      values: [
        {
          association: 'entities',
          label: 'Entities',
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
