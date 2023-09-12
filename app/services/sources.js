const paramHelper = require('../helpers/param');
const { TABLE: ENTITIES_TABLE } = require('../models/entities');
const { TABLE: INCIDENTS_TABLE } = require('../models/incidents');
const { TABLE, FIELDS, adaptResult, adaptEntitiesResult } = require('../models/sources');
const db = require('../services/db');

const type = 'activity';

const getAllQuery = (options = {}) => {
  const { includeCount = false } = options;

  const clauses = [];
  const selections = [];
  const params = [];

  clauses.push('SELECT');
  FIELDS.forEach(field => {
    selections.push(`${TABLE}.${field}`);
  });

  if (includeCount) {
    selections.push(`COUNT(${INCIDENTS_TABLE}.id) AS total`);
  }

  clauses.push(selections.join(', '));
  clauses.push(`FROM ${TABLE}`);

  if (includeCount) {
    clauses.push(`LEFT JOIN ${INCIDENTS_TABLE} ON ${INCIDENTS_TABLE}.data_source_id = ${TABLE}.id`);
  }

  clauses.push('WHERE');
  clauses.push('type = ?');
  params.push(type);

  if (includeCount) {
    clauses.push(`GROUP BY ${INCIDENTS_TABLE}.data_source_id`);
  }

  clauses.push(`ORDER BY ${TABLE}.id ASC`);

  return { clauses, params };
};

const getAll = async (options = {}) => {
  const { clauses, params } = getAllQuery(options);
  const results = await db.getAll(clauses, params);

  return results.map(adaptResult);
};

const getAtIdQuery = (id) => {
  const clauses = [];
  const selections = [];
  const params = [];

  clauses.push('SELECT');
  FIELDS.forEach(field => {
    selections.push(`${TABLE}.${field}`);
  });
  clauses.push(selections.join(', '));
  clauses.push(`FROM ${TABLE}`);
  clauses.push('WHERE');
  clauses.push('id = ?');
  params.push(id);

  clauses.push('LIMIT 1');

  return { clauses, params };
};

const getAtId = async (id) => {
  const { clauses, params } = getAtIdQuery(id);
  const result = await db.get(clauses, params);

  return result;
};

const getEntitiesForIdQuery = (id) => {
  const clauses = [];
  const selections = [];
  const params = [];

  clauses.push('SELECT');

  selections.push(`${ENTITIES_TABLE}.id`);
  selections.push(`${ENTITIES_TABLE}.name`);
  selections.push(`COUNT(${INCIDENTS_TABLE}.entity_id) AS total`);

  clauses.push(selections.join(', '));

  clauses.push(`FROM ${INCIDENTS_TABLE}`);
  clauses.push(`LEFT JOIN ${ENTITIES_TABLE} ON ${INCIDENTS_TABLE}.entity_id = ${ENTITIES_TABLE}.id`);
  clauses.push('WHERE');
  clauses.push(`${INCIDENTS_TABLE}.data_source_id = ?`);
  params.push(id);

  clauses.push(`GROUP BY ${INCIDENTS_TABLE}.entity_id`);
  clauses.push('ORDER BY total DESC');

  return { clauses, params };
};

const getEntitiesForId = async (id) => {
  const { clauses, params } = getEntitiesForIdQuery(id);
  const results = await db.getAll(clauses, params);

  return results.map(adaptEntitiesResult);
};

const getIdForQuarterQuery = (quarter) => {
  const clauses = [];
  const params = [];

  const [q, y] = paramHelper.getQuarterAndYear(quarter);

  clauses.push('SELECT');
  clauses.push('id');
  clauses.push(`FROM ${TABLE}`);
  clauses.push('WHERE');
  clauses.push('year = ? AND quarter = ?');
  params.push(y, q);

  clauses.push('AND');
  clauses.push('type = ?');
  params.push(type);

  clauses.push('LIMIT 1');

  return { clauses, params };
};

const getIdForQuarter = async (quarter) => {
  const { clauses, params } = getIdForQuarterQuery(quarter);
  const result = await db.get(clauses, params);

  return result?.id;
};

const getStatsQuery = () => {
  const clauses = [];
  const columns = [];
  const params = [];

  clauses.push('SELECT');
  columns.push(
    `${TABLE}.id`,
    `${TABLE}.year`,
    `${TABLE}.quarter`,
    `COUNT(${INCIDENTS_TABLE}.id) AS total`
  );

  clauses.push(columns.join(', '));
  clauses.push(`FROM ${TABLE}`);
  clauses.push(`LEFT JOIN ${INCIDENTS_TABLE} ON ${INCIDENTS_TABLE}.data_source_id = ${TABLE}.id`);
  clauses.push('WHERE');
  clauses.push('type = ?');
  params.push(type);
  clauses.push(`GROUP BY ${INCIDENTS_TABLE}.data_source_id`);
  clauses.push(`ORDER BY ${TABLE}.id ASC`);

  return { clauses, params };
};

const getStats = async () => {
  const { clauses, params } = getStatsQuery();
  const results = await db.getAll(clauses, params);

  return results.map(result => ({
    id: result.id,
    label: 'Q' + result.quarter + ' ' + result.year,
    total: result.total,
  }));
};

const getTotalQuery = () => {
  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push('COUNT(id) AS total');
  clauses.push(`FROM ${TABLE}`);

  clauses.push('WHERE');
  clauses.push('type = ?');
  params.push(type);

  return { clauses, params };
};

const getTotal = async () => {
  const { clauses, params } = getTotalQuery();
  const result = await db.get(clauses, params);

  return result.total;
};

module.exports = {
  getAll,
  getAllQuery,
  getAtId,
  getAtIdQuery,
  getEntitiesForId,
  getEntitiesForIdQuery,
  getIdForQuarter,
  getIdForQuarterQuery,
  getStats,
  getStatsQuery,
  getTotal,
  getTotalQuery,
};
