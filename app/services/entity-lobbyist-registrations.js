const { TABLE } = require('../models/entity-lobbyist-registrations');
const db = require('../services/db');

const getTotalQuery = (options = {}) => {
  const {
    entityId,
    personId,
  } = options;
  const hasEntityId = Boolean(entityId);
  const hasPersonId = Boolean(personId);

  const clauses = [];
  const conditions = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push('COUNT(id) AS total');
  clauses.push(`FROM ${TABLE}`);

  if (hasEntityId || hasPersonId) {
    clauses.push('WHERE');
  }

  if (hasEntityId) {
    conditions.push(`${TABLE}.entity_id = ?`);
    params.push(entityId);
  }

  if (hasPersonId) {
    conditions.push(`${TABLE}.person_id = ?`);
    params.push(personId);
  }

  if (conditions.length) {
    clauses.push(conditions.join(' AND '));
  }

  return { clauses, params };
};

const getTotal = async (options = {}) => {
  const { clauses, params } = getTotalQuery(options);
  const result = await db.get(clauses, params);

  return result.total;
};

module.exports = {
  getTotal,
  getTotalQuery,
};
