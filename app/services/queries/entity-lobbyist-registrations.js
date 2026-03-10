const queryHelper = require('../../helpers/query');

const Entities = require('../tables/entities');
const EntityLobbyistRegistrations = require('../tables/entity-lobbyist-registrations');
const People = require('../tables/people');
const Sources = require('../tables/data-sources');

const SOURCES_FIELDS = [
  'quarter',
  'year',
];

const getQuartersQuery = (options = {}) => {
  const {
    entityId,
    personId,
  } = options;
  const hasEntityId = Boolean(entityId);
  const hasPersonId = Boolean(personId);

  const clauses = [];
  const selections = [];
  const conditions = [];
  const params = [];

  clauses.push('SELECT');

  SOURCES_FIELDS.forEach(field => {
    selections.push(Sources.field(field));
  });

  clauses.push(selections.join(', '));
  clauses.push(`FROM ${EntityLobbyistRegistrations.tableName()}`);

  clauses.push(queryHelper.leftJoin(EntityLobbyistRegistrations, Sources, true));

  if (hasEntityId || hasPersonId) {
    clauses.push('WHERE');
  }

  if (hasEntityId) {
    conditions.push(`${EntityLobbyistRegistrations.field(Entities.foreignKey())} = ?`);
    params.push(entityId);
  }

  if (hasPersonId) {
    conditions.push(`${EntityLobbyistRegistrations.field(People.foreignKey())} = ?`);
    params.push(personId);
  }

  if (conditions.length) {
    clauses.push(...queryHelper.joinConditions(conditions));
  }

  clauses.push('ORDER BY');
  clauses.push(`${Sources.field('year')} ASC, ${Sources.field('quarter')} ASC`);

  return { clauses, params };
};

const getTotalQuery = (options = {}) => {
  const {
    entityId,
    personId,
  } = options;
  const hasEntityId = Boolean(entityId);
  const hasPersonId = Boolean(personId);

  const clauses = [];
  const conditions = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(`COUNT(${EntityLobbyistRegistrations.primaryKey()}) AS total`);
  clauses.push(`FROM ${EntityLobbyistRegistrations.tableName()}`);

  if (hasEntityId || hasPersonId) {
    clauses.push('WHERE');
  }

  if (hasEntityId) {
    conditions.push(`${EntityLobbyistRegistrations.field(Entities.foreignKey())} = ?`);
    params.push(entityId);
  }

  if (hasPersonId) {
    conditions.push(`${EntityLobbyistRegistrations.field(People.foreignKey())} = ?`);
    params.push(personId);
  }

  if (conditions.length) {
    clauses.push(...queryHelper.joinConditions(conditions));
  }

  return { clauses, params };
};

const getHasBeenCityEmployeeQuery = (options = {}) => {
  const { personId } = options;
  const hasPersonId = Boolean(personId);

  const clauses = [];
  const conditions = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(`IF(COUNT(${EntityLobbyistRegistrations.primaryKey()}) > 0, 'true', 'false') AS hasBeenEmployee`);

  clauses.push(`FROM ${EntityLobbyistRegistrations.tableName()}`);

  if (hasPersonId) {
    clauses.push('WHERE');
    conditions.push(`${EntityLobbyistRegistrations.field('was_city_employee')} = 1`);
    conditions.push(`${EntityLobbyistRegistrations.field('length_of_employment')} IS NOT NULL`);
    conditions.push(`${EntityLobbyistRegistrations.field(People.foreignKey())} = ?`);
    params.push(personId);
  }

  if (conditions.length) {
    // clauses.push(conditions.join(' AND '));
    clauses.push(...queryHelper.joinConditions(conditions));
  }

  return { clauses, params };
};

module.exports = {
  getQuartersQuery,
  getTotalQuery,
  getHasBeenCityEmployeeQuery,
};
