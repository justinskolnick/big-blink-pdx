const { uniqueObjects } = require('../lib/array');
const OfficialPosition = require('../models/official-position');
const { getAtPernrQuery } = require('./queries/official-positions');

const db = require('./db');

const getAtPernr = async (pernr) => {
  const { clauses, params } = getAtPernrQuery(pernr);
  const results = await db.getAll(clauses, params);
  const uniqueResults = uniqueObjects(results);

  return uniqueResults.map(result => new OfficialPosition(result));
};

module.exports = {
  getAtPernr,
};
