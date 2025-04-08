const EntityLobbyistRegistration = require('../models/entity-lobbyist-registration');
const db = require('./db');
const {
  getQuartersQuery,
  getTotalQuery,
} = require('./queries/entity-lobbyist-registrations');

const getQuarters = async (options = {}) => {
  const { clauses, params } = getQuartersQuery(options);
  const results = await db.getAll(clauses, params);

  return results.map(result => {
    const registration = new EntityLobbyistRegistration(result);

    return registration.adapted;
  });
};

const getTotal = async (options = {}) => {
  const { clauses, params } = getTotalQuery(options);
  const result = await db.get(clauses, params);

  return result.total;
};

module.exports = {
  getQuarters,
  getTotal,
};
