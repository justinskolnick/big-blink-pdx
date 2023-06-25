const dateHelper = require('../helpers/date');
const paramHelper = require('../helpers/param');
const { TABLE: INCIDENTS_TABLE } = require('../models/incidents');
const { TABLE, FIELDS } = require('../models/sources');
const db = require('../services/db');

const adaptRetrievedDate = str => dateHelper.formatDateString(str);

const adaptResult = (result) => ({
  id: result.id,
  format: result.format,
  title: result.title,
  year: result.year,
  quarter: result.quarter,
  publicUrl: result.public_url,
  retrievedDate: adaptRetrievedDate(result.retrieved_at),
  incidents: {
    total: result.total,
  },
});

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
  clauses.push('WHERE id = ?');
  params.push(id);

  clauses.push('LIMIT 1');

  return { clauses, params };
};

const getAtId = async (id) => {
  const { clauses, params } = getAtIdQuery(id);
  const result = await db.get(clauses, params);

  return adaptResult(result);
};

const getIdForQuarterQuery = (quarter) => {
  const clauses = [];
  const params = [];

  const [q, y] = paramHelper.getQuarterAndYear(quarter);

  clauses.push('SELECT');
  clauses.push('id');
  clauses.push(`FROM ${TABLE}`);
  clauses.push('WHERE year = ? AND quarter = ?');
  params.push(y, q);

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
  clauses.push(`GROUP BY ${INCIDENTS_TABLE}.data_source_id`);
  clauses.push(`ORDER BY ${TABLE}.id ASC`);

  return { clauses };
};

const getStats = async () => {
  const { clauses } = getStatsQuery();
  const results = await db.getAll(clauses);

  return results.map(result => ({
    id: result.id,
    label: 'Q' + result.quarter + ' ' + result.year,
    total: result.total,
  }));
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
  getIdForQuarter,
  getIdForQuarterQuery,
  getStats,
  getStatsQuery,
  getTotal,
  getTotalQuery,
};
