const CityOfficeTerms = require('../models/city-office-term');

const db = require('./db');
const { getAllQuery } = require('./queries/city-office-terms');

const getAll = async (options = {}) => {
  const { clauses, params } = getAllQuery(options);
  const results = await db.getAll(clauses, params);

  return results.map(result => {
    const cityOfficeTerm = new CityOfficeTerms(result);

    return cityOfficeTerm.adapted;
  });
};

module.exports = {
  getAll,
};
