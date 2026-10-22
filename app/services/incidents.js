const Incident = require('../models/incident');

const db = require('./db');
const {
  getAllQuery,
  getAtIdQuery,
  getEstimatedTotalQuery,
  getFirstAndLastDatesQuery,
  getTotalQuery,
} = require('./queries/incidents');

const getAll = async (options = {}) => {
  const { clauses, params } = getAllQuery(options);
  const results = await db.getAll(clauses, params);

  return results.map(result => new Incident(result));
};

const getAtId = async (id) => {
  const { clauses, params } = getAtIdQuery(id);
  const result = await db.get(clauses, params);

  return new Incident(result);
};

const getEstimatedTotal = async (options = {}) => {
  const { clauses, params } = getEstimatedTotalQuery(options);
  const results = await db.getAll(clauses, params);

  return results.map(result => result.contact_type).reduce((total, contactTypes) => {
    const contactTypeCount = contactTypes.split('; ').length;

    if (contactTypeCount > 0) {
      return total + contactTypeCount;
    }

    return total;
  }, 0);
};

const getFirstAndLastDates = async (options = {}) => {
  const { clauses, params } = getFirstAndLastDatesQuery(options);
  const results = await db.getAll(clauses, params);

  const [first, last] = results.map(result => {
    const incident = new Incident(result);

    return incident.adapted;
  });

  return {
    first,
    last,
  };
};

const getTotal = async (options = {}) => {
  const { clauses, params } = getTotalQuery(options);
  const result = await db.get(clauses, params);

  return result.total;
};

module.exports = {
  getAll,
  getAtId,
  getEstimatedTotal,
  getFirstAndLastDates,
  getTotal,
};
