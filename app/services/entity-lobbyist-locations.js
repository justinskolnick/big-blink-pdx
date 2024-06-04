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
    clauses.push(`${EntityLobbyistLocation.tableName}.region DESC, ${EntityLobbyistLocation.tableName}.city ASC`);
  }

  return { clauses, params };
};

const getAll = async (options = {}) => {
  const { clauses, params } = getAllQuery(options);
  const results = await db.getAll(clauses, params);

  return results.map(result => EntityLobbyistLocation.adapt(result));
};

module.exports = {
  getAll,
  getAllQuery,
};
