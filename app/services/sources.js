const paramHelper = require('../helpers/param');
const Entity = require('../models/entity');
const Incident = require('../models/incident');
const Source = require('../models/source');
const db = require('../services/db');

const getAllQuery = (options = {}) => {
  const { includeCount = false, types = [] } = options;

  const clauses = [];
  const selections = [];
  const params = [];

  clauses.push('SELECT');

  selections.push(...Source.fields());

  if (includeCount) {
    selections.push(`COUNT(${Incident.tableName}.id) AS total`);
  }

  clauses.push(selections.join(', '));
  clauses.push(`FROM ${Source.tableName}`);

  if (includeCount) {
    clauses.push(`LEFT JOIN ${Incident.tableName} ON ${Incident.tableName}.data_source_id = ${Source.tableName}.id`);
  }

  if (types.length > 0) {
    clauses.push('WHERE');

    if (types.length > 1) {
      clauses.push('type in (' + Array(types.length).fill('?').join(',') + ')');
    } else {
      clauses.push('type = ?');
    }

    params.push(...types);
  }

  if (includeCount) {
    clauses.push(`GROUP BY ${Incident.tableName}.data_source_id`);
  }

  clauses.push(`ORDER BY ${Source.tableName}.id ASC`);

  return { clauses, params };
};

const getAll = async (options = {}) => {
  const { clauses, params } = getAllQuery(options);
  const results = await db.getAll(clauses, params);

  return results.map(Source.adapt);
};

const getAtIdQuery = (id) => {
  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(Source.fields().join(', '));
  clauses.push(`FROM ${Source.tableName}`);
  clauses.push('WHERE');
  clauses.push('id = ?');
  params.push(id);

  clauses.push('LIMIT 1');

  return { clauses, params };
};

const getAtId = async (id) => {
  const { clauses, params } = getAtIdQuery(id);
  const result = await db.get(clauses, params);

  return Source.adapt(result);
};

const getEntitiesForIdQuery = (id) => {
  const clauses = [];
  const selections = [];
  const params = [];

  clauses.push('SELECT');

  selections.push(`${Entity.tableName}.id`);
  selections.push(`${Entity.tableName}.name`);
  selections.push(`COUNT(${Incident.tableName}.entity_id) AS total`);

  clauses.push(selections.join(', '));

  clauses.push(`FROM ${Incident.tableName}`);
  clauses.push(`LEFT JOIN ${Entity.tableName} ON ${Incident.tableName}.entity_id = ${Entity.tableName}.id`);
  clauses.push('WHERE');
  clauses.push(`${Incident.tableName}.data_source_id = ?`);
  params.push(id);

  clauses.push(`GROUP BY ${Incident.tableName}.entity_id`);
  clauses.push('ORDER BY total DESC');

  return { clauses, params };
};

const getEntitiesForId = async (id) => {
  const { clauses, params } = getEntitiesForIdQuery(id);
  const results = await db.getAll(clauses, params);

  return results.map(Source.adaptEntity);
};

const getIdForQuarterQuery = (quarter) => {
  const clauses = [];
  const params = [];

  const [q, y] = paramHelper.getQuarterAndYear(quarter);

  clauses.push('SELECT');
  clauses.push('id');
  clauses.push(`FROM ${Source.tableName}`);
  clauses.push('WHERE');
  clauses.push('year = ? AND quarter = ?');
  params.push(y, q);

  clauses.push('AND');
  clauses.push('type = ?');
  params.push(Source.types.activity);

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
    `${Source.tableName}.id`,
    `${Source.tableName}.year`,
    `${Source.tableName}.quarter`,
    `COUNT(${Incident.tableName}.id) AS total`
  );

  clauses.push(columns.join(', '));
  clauses.push(`FROM ${Source.tableName}`);
  clauses.push(`LEFT JOIN ${Incident.tableName} ON ${Incident.tableName}.data_source_id = ${Source.tableName}.id`);
  clauses.push('WHERE');
  clauses.push('type = ?');
  params.push(Source.types.activity);
  clauses.push(`GROUP BY ${Incident.tableName}.data_source_id`);
  clauses.push(`ORDER BY ${Source.tableName}.id ASC`);

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

const getTotalQuery = (options = {}) => {
  const { types = [] } = options;

  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push('COUNT(id) AS total');
  clauses.push(`FROM ${Source.tableName}`);

  if (types.length > 0) {
    clauses.push('WHERE');

    if (types.length > 1) {
      clauses.push('type in (' + Array(types.length).fill('?').join(',') + ')');
    } else {
      clauses.push('type = ?');
    }

    params.push(...types);
  }

  return { clauses, params };
};

const getTotal = async (options = {}) => {
  const { clauses, params } = getTotalQuery(options);
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
