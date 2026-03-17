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
  let associatedPerson = null;

  beforeEach(() => {
    associatedPerson = new AssociatedPerson();
    associatedPerson.setAssociatedModel(Person);
  });

  afterEach(() => {
    associatedPerson = null;
  });

  test('returns the expected results', () => {
    expect(associatedPerson.getAssociation('lobbyist')).toEqual('lobbyists');
    expect(associatedPerson.getAssociation('official')).toEqual('officials');
  });
});

describe('getValueLabelKey()', () => {
  let associatedPerson = null;

  beforeEach(() => {
    associatedPerson = new AssociatedPerson();
    associatedPerson.setAssociatedModel(Person);
  });

  afterEach(() => {
    associatedPerson = null;
  });

  test('returns the expected results', () => {
    expect(associatedPerson.getValueLabelKey('entity', 'lobbyists')).toEqual('as_entity_lobbyists');
    expect(associatedPerson.getValueLabelKey('entity', 'lobbyists')).toEqual('as_entity_lobbyists');
    expect(associatedPerson.getValueLabelKey('entity', 'officials')).toEqual('as_entity_officials');
    expect(associatedPerson.getValueLabelKey('entity', 'officials')).toEqual('as_entity_officials');
    expect(associatedPerson.getValueLabelKey('lobbyist', 'lobbyists')).toEqual('as_lobbyist_lobbyists');
    expect(associatedPerson.getValueLabelKey('lobbyist', 'officials')).toEqual('as_lobbyist_officials');
    expect(associatedPerson.getValueLabelKey('official', 'lobbyists')).toEqual('as_official_lobbyists');
    expect(associatedPerson.getValueLabelKey('official', 'officials')).toEqual('as_official_officials');
  });
});

describe('toRoleObject()', () => {
  let associatedPerson = null;

  beforeEach(() => {
    associatedPerson = new AssociatedPerson();
    associatedPerson.setAssociatedModel(Person);
  });

  afterEach(() => {
    associatedPerson = null;
  });

  describe('with an Entity', () => {
    test('returns the expected object', () => {
      expect(associatedPerson.toRoleObject(ROLE_ENTITY, resultEntityAttendees, Entity.labelPrefix)).toEqual({
        label: 'Associated People',
        options: [
          'lobbyist',
          'official',
        ],
        type: 'person',
        values: [
          {
            association: 'lobbyists',
            label: 'Authorized these lobbyists',
            links: {
              intro: {
                label: 'View',
              },
              options: [
                {
                  label: '5',
                  params: {
                    limit: 5,
                  }
                },
                {
                  label: 'All',
                  params: {
                    limit: 6,
                  }
                },
              ],
              total: {
                label: '6 lobbyists',
              },
            },
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
              {
                person: {
                  id: 126,
                  links: {
                    self: '/people/126',
                  },
                  name: 'Tonda Vierk',
                  pernr: undefined,
                  roles: {
                    label: 'Roles and Associations',
                    list: [],
                    options: {},
                  },
                  type: 'person',
                },
                total: 592,
              },
              {
                person: {
                  id: 127,
                  links: {
                    self: '/people/127',
                  },
                  name: 'Danae Buntjer',
                  pernr: undefined,
                  roles: {
                    label: 'Roles and Associations',
                    list: [],
                    options: {},
                  },
                  type: 'person',
                },
                total: 51,
              },
              {
                person: {
                  id: 128,
                  links: {
                    self: '/people/128',
                  },
                  name: 'Dirk Chiarello',
                  pernr: undefined,
                  roles: {
                    label: 'Roles and Associations',
                    list: [],
                    options: {},
                  },
                  type: 'person',
                },
                total: 2,
              },
            ],
            role: 'lobbyist',
            total: 6,
          },
          {
            association: 'officials',
            label: 'Lobbied these City officials',
            links: {
              intro: null,
              options: null,
              total: {
                label: '2 officials',
              },
            },
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
        expect(associatedPerson.toRoleObject(ROLE_LOBBYIST, resultPersonAttendees, Person.labelPrefix)).toEqual({
          label: 'Associated People',
          options: [
            'lobbyist',
            'official',
          ],
          type: 'person',
          values: [
            {
              association: 'lobbyists',
              label: 'Lobbied alongside these lobbyists',
              links: {
                intro: null,
                options: null,
                total: {
                  label: '3 lobbyists',
                },
              },
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
              links: {
                intro: null,
                options: null,
                total: {
                  label: '2 officials',
                },
              },
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
        expect(associatedPerson.toRoleObject(ROLE_OFFICIAL, resultPersonAttendees, Person.labelPrefix)).toEqual({
          label: 'Associated People',
          options: [
            'lobbyist',
            'official',
          ],
          type: 'person',
          values: [
            {
              association: 'lobbyists',
              label: 'Was lobbied by these lobbyists',
              links: {
                intro: null,
                options: null,
                total: {
                  label: '3 lobbyists',
                },
              },
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
              links: {
                intro: null,
                options: null,
                total: {
                  label: '2 officials',
                },
              },
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
      expect(associatedPerson.toRoleObject(ROLE_SOURCE, resultSourceAttendees, Source.labelPrefix)).toEqual({
        label: 'Associated People',
        options: [
          'lobbyist',
          'official',
        ],
        type: 'person',
        values: [
          {
            association: 'lobbyists',
            label: 'Lobbyists',
            links: {
              intro: null,
              options: null,
              total: {
                label: '3 lobbyists',
              },
            },
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
            links: {
              intro: null,
              options: null,
              total: {
                label: '2 officials',
              },
            },
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
