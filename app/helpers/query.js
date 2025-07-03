const { execute } = require('../lib/mysql');

const getOffset = (currentPage = 1, perPage = 20) => (currentPage - 1) * perPage;

const joinConditions = conditions => (
  conditions.reduce((all, item, i) => {
    if (i > 0) {
      all.push('AND');
    }

    all.push(item);

    return all;
  }, [])
);

const query = async (clauses, params = []) => {
  const sql = Array.isArray(clauses) ? clauses.join(' ') : clauses;
  const results = await execute(sql, params);

  return results;
};

module.exports = {
  getOffset,
  joinConditions,
  query,
};
