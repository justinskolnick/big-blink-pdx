const Incident = require('../models/incident');
const db = require('../services/db');
const {
  getAllQuery,
  getTotalQuery,
} = require('./queries/incident-attendances');

const getAll = async (options = {}) => {
  const { clauses, params } = getAllQuery(options);
  const results = await db.getAll(clauses, params);

  return results.map(result => new Incident(result));
};

const getTotal = async (options = {}) => {
  const { clauses, params } = getTotalQuery(options);
  const result = await db.get(clauses, params);

  return result.total;
};

module.exports = {
  getAll,
  getTotal,
};
