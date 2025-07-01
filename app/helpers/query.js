const { execute } = require('../lib/mysql');

const getOffset = (currentPage = 1, perPage = 20) => (currentPage - 1) * perPage;

const query = async (clauses, params = []) => {
  const sql = Array.isArray(clauses) ? clauses.join(' ') : clauses;
  const results = await execute(sql, params);

  return results;
};

module.exports = {
  getOffset,
  query,
};
