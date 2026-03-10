const Entities = require('../tables/entities');
const EntityLobbyistLocations = require('../tables/entity-lobbyist-locations');

const getAllQuery = (options = {}) => {
  const {
    entityId,
  } = options;

  const clauses = [];
  const params = [];

  if (entityId) {
    clauses.push('SELECT');
    clauses.push(EntityLobbyistLocations.fields().join(', '));
    clauses.push(`FROM ${EntityLobbyistLocations.tableName()}`);
    clauses.push('WHERE');
    clauses.push(`${Entities.foreignKey()} = ?`);
    params.push(entityId);

    clauses.push('ORDER BY');
    clauses.push(`${EntityLobbyistLocations.field('region')} DESC, ${EntityLobbyistLocations.field('city')} ASC`);
  }

  return { clauses, params };
};

module.exports = {
  getAllQuery,
};
