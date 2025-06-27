const Quarter = require('../models/quarter');
const { getQuarterQuery } = require('./queries/quarters');

const db = require('./db');

const getQuarter = async (options = {}) => {
  const { clauses, params } = getQuarterQuery(options);
  const result = await db.get(clauses, params);

  return new Quarter(result);
};

module.exports = {
  getQuarter,
};
