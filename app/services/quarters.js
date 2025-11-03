const Quarter = require('../models/quarter');
const {
  getAllQuery,
  getQuarterQuery,
} = require('./queries/quarters');

const db = require('./db');

const getQuarter = async (options = {}) => {
  const { clauses, params } = getQuarterQuery(options);
  const result = await db.get(clauses, params);

  return new Quarter(result);
};

const getAll = async (options = {}) => {
  const { clauses, params } = getAllQuery(options);
  const results = await db.getAll(clauses, params);

  return results.map(result => new Quarter(result));
};

module.exports = {
  getAll,
  getQuarter,
};
