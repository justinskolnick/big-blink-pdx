const Source = require('../models/source');
const db = require('./db');
const {
  getAllQuery,
  getAtIdQuery,
  getEntitiesForIdQuery,
  getEntitiesTotalForIdQuery,
  getIdForQuarterQuery,
  getStatsQuery,
  getTotalQuery,
} = require('./queries/sources');

const getAll = async (options = {}) => {
  const { clauses, params } = getAllQuery(options);
  const results = await db.getAll(clauses, params);

  return results.map(result => new Source(result));
};

const getAtId = async (id) => {
  const { clauses, params } = getAtIdQuery(id);
  const result = await db.get(clauses, params);

  return new Source(result);
};

const getEntitiesRecords = async (id) => {
  const { clauses, params } = getEntitiesForIdQuery(id);
  const results = await db.getAll(clauses, params);

  return results.map(Source.adaptEntity);
};

const getEntitiesTotal = async (id) => {
  const { clauses, params } = getEntitiesTotalForIdQuery(id);
  const result = await db.get(clauses, params);

  return result.total;
};

const getEntitiesForId = async (id) => {
  const results = await Promise.all([
    getEntitiesTotal(id),
    getEntitiesRecords(id),
  ]);
  const [total, records] = results;

  return {
    records,
    total,
  };
};

const getIdForQuarter = async (quarter) => {
  const { clauses, params } = getIdForQuarterQuery(quarter);
  const result = await db.get(clauses, params);

  return result?.id;
};

const getStats = async () => {
  const { clauses, params } = getStatsQuery();
  const results = await db.getAll(clauses, params);

  return results.map(result => ({
    id: result.id,
    label: `${result.year} Q${result.quarter}`,
    total: result.total,
  }));
};

const getTotal = async (options = {}) => {
  const { clauses, params } = getTotalQuery(options);
  const result = await db.get(clauses, params);

  return result.total;
};

module.exports = {
  getAll,
  getAtId,
  getEntitiesForId,
  getIdForQuarter,
  getStats,
  getTotal,
};
