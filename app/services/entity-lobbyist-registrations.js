const EntityLobbyistRegistration = require('../models/entity-lobbyist-registration');
const Source = require('../models/source');
const db = require('../services/db');

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
    selections.push(`${Source.tableName}.${field}`);
  });

  clauses.push(selections.join(', '));
  clauses.push(`FROM ${EntityLobbyistRegistration.tableName}`);

  clauses.push(`LEFT JOIN ${Source.tableName} ON ${Source.tableName}.id = ${EntityLobbyistRegistration.tableName}.data_source_id`);

  if (hasEntityId || hasPersonId) {
    clauses.push('WHERE');
  }

  if (hasEntityId) {
    conditions.push(`${EntityLobbyistRegistration.tableName}.entity_id = ?`);
    params.push(entityId);
  }

  if (hasPersonId) {
    conditions.push(`${EntityLobbyistRegistration.tableName}.person_id = ?`);
    params.push(personId);
  }

  if (conditions.length) {
    clauses.push(conditions.join(' AND '));
  }

  clauses.push('ORDER BY');
  clauses.push(`${Source.tableName}.year ASC, ${Source.tableName}.quarter ASC`);

  return { clauses, params };
};

const getQuarters = async (options = {}) => {
  const { clauses, params } = getQuartersQuery(options);
  const results = await db.getAll(clauses, params);

  return results.map(result => EntityLobbyistRegistration.adapt(result));
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
  clauses.push('COUNT(id) AS total');
  clauses.push(`FROM ${EntityLobbyistRegistration.tableName}`);

  if (hasEntityId || hasPersonId) {
    clauses.push('WHERE');
  }

  if (hasEntityId) {
    conditions.push(`${EntityLobbyistRegistration.tableName}.entity_id = ?`);
    params.push(entityId);
  }

  if (hasPersonId) {
    conditions.push(`${EntityLobbyistRegistration.tableName}.person_id = ?`);
    params.push(personId);
  }

  if (conditions.length) {
    clauses.push(conditions.join(' AND '));
  }

  return { clauses, params };
};

const getTotal = async (options = {}) => {
  const { clauses, params } = getTotalQuery(options);
  const result = await db.get(clauses, params);

  return result.total;
};

module.exports = {
  getQuarters,
  getQuartersQuery,
  getTotal,
  getTotalQuery,
};
