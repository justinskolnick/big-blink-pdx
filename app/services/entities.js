const paramHelper = require('../helpers/param');
const queryHelper = require('../helpers/query');
const Entity = require('../models/entity');
const Incident = require('../models/incident');
const db = require('../services/db');

const {
  SORT_ASC,
  SORT_BY_NAME,
  SORT_BY_TOTAL,
  SORT_DESC,
} = paramHelper;

const getAllQuery = (options = {}) => {
  const {
    page,
    perPage,
    limit,
    includeCount = false,
    sort,
    sortBy = SORT_BY_NAME,
  } = options;

  const clauses = [];
  const selections = [];
  const params = [];

  clauses.push('SELECT');

  selections.push(...Entity.fields());

  if (includeCount) {
    selections.push(`COUNT(${Incident.tableName}.id) AS total`);
  }

  if (!sortBy || sortBy === SORT_BY_NAME) {
    selections.push(`CASE WHEN ${Entity.tableName}.name LIKE 'The %' THEN TRIM(SUBSTR(${Entity.tableName}.name FROM 4)) ELSE ${Entity.tableName}.name END AS sort_name`);
  }

  clauses.push(selections.join(', '));
  clauses.push(`FROM ${Entity.tableName}`);

  if (includeCount) {
    clauses.push(`LEFT JOIN ${Incident.tableName} ON ${Incident.tableName}.entity_id = ${Entity.tableName}.id`);
    clauses.push(`GROUP BY ${Entity.tableName}.id`);
  }

  clauses.push('ORDER BY');

  if (includeCount && sortBy === SORT_BY_TOTAL) {
    clauses.push(`total ${sort || SORT_DESC}`);
  } else {
    clauses.push(`sort_name ${sort || SORT_ASC}`);
  }

  if (page && perPage) {
    const offset = queryHelper.getOffset(page, perPage);

    clauses.push('LIMIT ?,?');
    params.push(offset, perPage);
  } else if (limit) {
    clauses.push('LIMIT ?,?');
    params.push(0, limit);
  }

  return { clauses, params };
};

const getAll = async (options = {}) => {
  const { clauses, params } = getAllQuery(options);
  const results = await db.getAll(clauses, params);

  return results.map(result => Entity.adapt(result));
};

const getAtIdQuery = (id) => {
  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(Entity.fields().join(', '));
  clauses.push(`FROM ${Entity.tableName}`);
  clauses.push('WHERE id = ?');
  params.push(id);

  clauses.push('LIMIT 1');

  return { clauses, params };
};

const getAtId = async (id) => {
  const { clauses, params } = getAtIdQuery(id);
  const result = await db.get(clauses, params);

  return Entity.adapt(result);
};

const getTotalQuery = () => `SELECT COUNT(id) AS total FROM ${Entity.tableName}`;

const getTotal = async () => {
  const sql = getTotalQuery();
  const result = await db.get(sql);

  return result.total;
};

module.exports = {
  getAll,
  getAllQuery,
  getAtId,
  getAtIdQuery,
  getTotal,
  getTotalQuery,
};
