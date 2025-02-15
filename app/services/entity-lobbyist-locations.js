const EntityLobbyistLocation = require('../models/entity-lobbyist-location');
const db = require('../services/db');

const getAllQuery = (options = {}) => {
  const {
    entityId,
  } = options;

  const clauses = [];
  const params = [];

  if (entityId) {
    clauses.push('SELECT');
    clauses.push(EntityLobbyistLocation.fields().join(', '));
    clauses.push(`FROM ${EntityLobbyistLocation.tableName}`);
    clauses.push('WHERE');
    clauses.push('entity_id = ?');
    params.push(entityId);

    clauses.push('ORDER BY');
    clauses.push(`${EntityLobbyistLocation.field('region')} DESC, ${EntityLobbyistLocation.field('city')} ASC`);
  }

  return { clauses, params };
};

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
  getAllQuery,
};
