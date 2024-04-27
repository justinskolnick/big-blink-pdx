const { TABLE } = require('../models/entity-lobbyist-registrations');
const { TABLE: SOURCES_TABLE } = require('../models/sources');
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
    selections.push(`${SOURCES_TABLE}.${field}`);
  });

  clauses.push(selections.join(', '));
  clauses.push(`FROM ${TABLE}`);

  clauses.push(`LEFT JOIN ${SOURCES_TABLE} ON ${SOURCES_TABLE}.id = ${TABLE}.data_source_id`);

  if (hasEntityId || hasPersonId) {
    clauses.push('WHERE');
  }

  if (hasEntityId) {
    conditions.push(`${TABLE}.entity_id = ?`);
    params.push(entityId);
  }

  if (hasPersonId) {
    conditions.push(`${TABLE}.person_id = ?`);
    params.push(personId);
  }

  if (conditions.length) {
    clauses.push(conditions.join(' AND '));
  }

  clauses.push('ORDER BY');
  clauses.push(`${SOURCES_TABLE}.year ASC, ${SOURCES_TABLE}.quarter ASC`);

  return { clauses, params };
};

const getQuarters = async (options = {}) => {
  const { clauses, params } = getQuartersQuery(options);
  const results = await db.getAll(clauses, params);

  return results;
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
  clauses.push(`FROM ${TABLE}`);

  if (hasEntityId || hasPersonId) {
    clauses.push('WHERE');
  }

  if (hasEntityId) {
    conditions.push(`${TABLE}.entity_id = ?`);
    params.push(entityId);
  }

  if (hasPersonId) {
    conditions.push(`${TABLE}.person_id = ?`);
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
