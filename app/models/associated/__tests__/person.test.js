const resultEntityAttendees = require('../../entity/__mocks__/result-entity-attendees');
const resultPersonAttendees = require('../../person/__mocks__/result-person-attendees');
const resultSourceAttendees = require('../../source/__mocks__/result-source-attendees');

const {
  ROLE_ENTITY,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
  ROLE_SOURCE,
} = require('../../../config/constants');

const AssociatedPerson = require('../person');
const Entity = require('../../entity/entity');
const Person = require('../../person/person');
const Source = require('../../source/source');

describe('getAssociation()', () => {
  test('returns the expected results', () => {
    expect(AssociatedPerson.getAssociation('lobbyist')).toEqual('lobbyists');
    expect(AssociatedPerson.getAssociation('official')).toEqual('officials');
  });
});

describe('getValueLabelKey()', () => {
  test('returns the expected results', () => {
    expect(AssociatedPerson.getValueLabelKey('entity', 'lobbyists')).toEqual('as_entity_lobbyists');
    expect(AssociatedPerson.getValueLabelKey('entity', 'lobbyists')).toEqual('as_entity_lobbyists');
    expect(AssociatedPerson.getValueLabelKey('entity', 'officials')).toEqual('as_entity_officials');
    expect(AssociatedPerson.getValueLabelKey('entity', 'officials')).toEqual('as_entity_officials');
    expect(AssociatedPerson.getValueLabelKey('lobbyist', 'lobbyists')).toEqual('as_lobbyist_lobbyists');
    expect(AssociatedPerson.getValueLabelKey('lobbyist', 'officials')).toEqual('as_lobbyist_officials');
    expect(AssociatedPerson.getValueLabelKey('official', 'lobbyists')).toEqual('as_official_lobbyists');
    expect(AssociatedPerson.getValueLabelKey('official', 'officials')).toEqual('as_official_officials');
  });
});

describe('toRoleObject()', () => {
  describe('with an Entity', () => {
    test('returns the expected object', () => {
      expect(AssociatedPerson.toRoleObject(ROLE_ENTITY, resultEntityAttendees, Entity.singular())).toEqual({
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

  describe('with a Person', () => {
    describe('who is a lobbyist', () => {
      test('returns the expected object', () => {
        expect(AssociatedPerson.toRoleObject(ROLE_LOBBYIST, resultPersonAttendees, Person.singular())).toEqual({
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

    describe('who is an official', () => {
      test('returns the expected object', () => {
        expect(AssociatedPerson.toRoleObject(ROLE_OFFICIAL, resultPersonAttendees, Person.singular())).toEqual({
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
              label: 'Was lobbied by these lobbyists',
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
              label: 'Was lobbied alongside these City officials',
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
  });

  describe('with a Source', () => {
    test('returns the expected object', () => {
      expect(AssociatedPerson.toRoleObject(ROLE_SOURCE, resultSourceAttendees, Source.singular())).toEqual({
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
            label: 'Lobbyists',
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
            label: 'City Officials',
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
});
