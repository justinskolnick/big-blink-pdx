const paramHelper = require('../helpers/param');
const queryHelper = require('../helpers/query');
const { TABLE, FIELDS } = require('../models/entities');
const { TABLE: INCIDENTS_TABLE } = require('../models/incidents');
const db = require('../services/db');

const adaptResults = (result) => ({
  id: result.id,
  name: result.name,
  incidents: {
    total: result.total,
  },
});

const getAllQuery = (options = {}) => {
  const {
    page,
    perPage,
    limit,
    includeCount = false,
    sortBy,
  } = options;

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
    clauses.push(`LEFT JOIN ${INCIDENTS_TABLE} ON ${INCIDENTS_TABLE}.entity_id = ${TABLE}.id`);
    clauses.push(`GROUP BY ${TABLE}.id`);
  }

  if (includeCount && sortBy === paramHelper.SORT_BY_TOTAL) {
    clauses.push('ORDER BY total DESC');
  } else {
    clauses.push(`ORDER BY ${TABLE}.name ASC`);
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

  return results.map(adaptResults);
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
  clauses.push('WHERE id = ?');
  params.push(id);

  clauses.push('LIMIT 1');

  return { clauses, params };
};

const getAtId = async (id) => {
  const { clauses, params } = getAtIdQuery(id);
  const result = await db.get(clauses, params);

  return result;
};

const getTotalQuery = () => `SELECT COUNT(id) AS total FROM ${TABLE}`;

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
