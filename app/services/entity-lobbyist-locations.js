const { TABLE, FIELDS, adaptResult } = require('../models/entity-lobbyist-locations');
const db = require('../services/db');

const getAllQuery = (options = {}) => {
  const {
    entityId,
  } = options;

  const clauses = [];
  const selections = [];
  const params = [];

  if (entityId) {
    clauses.push('SELECT');
    FIELDS.forEach(field => {
      selections.push(`${TABLE}.${field}`);
    });

    clauses.push(selections.join(', '));
    clauses.push(`FROM ${TABLE}`);
    clauses.push('WHERE');
    clauses.push('entity_id = ?');
    params.push(entityId);

    clauses.push('ORDER BY');
    clauses.push(`${TABLE}.region DESC, ${TABLE}.city ASC`);
  }

  return { clauses, params };
};

const getAll = async (options = {}) => {
  const { clauses, params } = getAllQuery(options);
  const results = await db.getAll(clauses, params);

  return results.map(adaptResult);
};

module.exports = {
  getAll,
  getAllQuery,
};
