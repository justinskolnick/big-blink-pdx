const queryHelper = require('../helpers/query');

const get = async (clauses, params = []) => {
  const results = await queryHelper.query(clauses, params);

  return results.at(0);
};

const getAll = async (clauses, params = []) => {
  const results = await queryHelper.query(clauses, params);

  return results;
};

module.exports = {
  get,
  getAll,
};
