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

const leftJoin = (modelOne, modelTwo, reverseKeys = false) => {
  const clauses = [];

  clauses.push(`LEFT JOIN ${modelTwo.tableName}`);
  clauses.push('ON');

  if (reverseKeys) {
    clauses.push(`${modelOne.field(modelTwo.foreignKey())} = ${modelTwo.primaryKey()}`);
  } else {
    clauses.push(`${modelTwo.field(modelOne.foreignKey())} = ${modelOne.primaryKey()}`);
  }

  return clauses.join(' ');
};

const query = async (clauses, params = []) => {
  const sql = Array.isArray(clauses) ? clauses.filter(Boolean).join(' ') : clauses;
  const results = await execute(sql, params);

  return results;
};

module.exports = {
  getOffset,
  joinConditions,
  leftJoin,
  query,
};
