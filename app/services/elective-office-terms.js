const ElectiveOfficeTerms = require('../models/elective-office-term');

const db = require('./db');
const { getAllQuery } = require('./queries/elective-office-terms');

const getAll = async (options = {}) => {
  const { clauses, params } = getAllQuery(options);
  const results = await db.getAll(clauses, params);

  return results.map(result => {
    const electiveOfficeTerm = new ElectiveOfficeTerms(result);

    return electiveOfficeTerm.adapted;
  });
};

module.exports = {
  getAll,
};
