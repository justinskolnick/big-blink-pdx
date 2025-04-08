const EntityLobbyistLocation = require('../models/entity-lobbyist-location');
const db = require('./db');
const { getAllQuery } = require('./queries/entity-lobbyist-locations');

const getAll = async (options = {}) => {
  const { clauses, params } = getAllQuery(options);
  const results = await db.getAll(clauses, params);

  return results.map(result => {
    const location = new EntityLobbyistLocation(result);

    return location.adapted;
  });
};

module.exports = {
  getAll,
};
