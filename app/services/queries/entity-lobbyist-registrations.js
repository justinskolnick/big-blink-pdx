const EntityLobbyistRegistration = require('../../models/entity-lobbyist-registration');
const Source = require('../../models/source');

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
    selections.push(Source.field(field));
  });

  clauses.push(selections.join(', '));
  clauses.push(`FROM ${EntityLobbyistRegistration.tableName}`);

  clauses.push(`LEFT JOIN ${Source.tableName} ON ${Source.primaryKey()} = ${EntityLobbyistRegistration.field('data_source_id')}`);

  if (hasEntityId || hasPersonId) {
    clauses.push('WHERE');
  }

  if (hasEntityId) {
    conditions.push(`${EntityLobbyistRegistration.field('entity_id')} = ?`);
    params.push(entityId);
  }

  if (hasPersonId) {
    conditions.push(`${EntityLobbyistRegistration.field('person_id')} = ?`);
    params.push(personId);
  }

  if (conditions.length) {
    clauses.push(conditions.join(' AND '));
  }

  clauses.push('ORDER BY');
  clauses.push(`${Source.field('year')} ASC, ${Source.field('quarter')} ASC`);

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
  clauses.push(`COUNT(${EntityLobbyistRegistration.primaryKey()}) AS total`);
  clauses.push(`FROM ${EntityLobbyistRegistration.tableName}`);

  if (hasEntityId || hasPersonId) {
    clauses.push('WHERE');
  }

  if (hasEntityId) {
    conditions.push(`${EntityLobbyistRegistration.field('entity_id')} = ?`);
    params.push(entityId);
  }

  if (hasPersonId) {
    conditions.push(`${EntityLobbyistRegistration.field('person_id')} = ?`);
    params.push(personId);
  }

  if (conditions.length) {
    clauses.push(conditions.join(' AND '));
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
  clauses.push(`IF(COUNT(${EntityLobbyistRegistration.primaryKey()}) > 0, 'true', 'false') AS hasBeenEmployee`);

  clauses.push(`FROM ${EntityLobbyistRegistration.tableName}`);

  if (hasPersonId) {
    clauses.push('WHERE');
    conditions.push(`${EntityLobbyistRegistration.field('was_city_employee')} = 1`);
    conditions.push(`${EntityLobbyistRegistration.field('length_of_employment')} IS NOT NULL`);
    conditions.push(`${EntityLobbyistRegistration.field('person_id')} = ?`);
    params.push(personId);
  }

  if (conditions.length) {
    clauses.push(conditions.join(' AND '));
  }

  return { clauses, params };
};

module.exports = {
  getQuartersQuery,
  getTotalQuery,
  getHasBeenCityEmployeeQuery,
};
