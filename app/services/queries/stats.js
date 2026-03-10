const Entities = require('../tables/entities');
const Incidents = require('../tables/incidents');
const IncidentAttendees = require('../tables/incident-attendees');
const People = require('../tables/people');
const Sources = require('../tables/data-sources');

const getStatsQuery = (options = {}) => {
  const { entityId, personId } = options;

  const clauses = [];
  const columns = [];
  const params = [];
  let id;

  clauses.push('SELECT');
  columns.push(
    `${Incidents.field(Sources.foreignKey())}`,
    `COUNT(${Incidents.primaryKey()}) AS total`,
  );

  clauses.push(columns.join(', '));
  clauses.push(`FROM ${Incidents.tableName()}`);

  if (entityId) {
    id = entityId;

    clauses.push(`WHERE ${Incidents.field(Entities.foreignKey())} = ?`);
    params.push(entityId);
  } else if (personId) {
    id = personId;

    clauses.push(`WHERE ${Incidents.primaryKey()} IN (SELECT ${Incidents.foreignKey()} FROM ${IncidentAttendees.tableName()} WHERE ${People.foreignKey()} = ?)`);
    params.push(personId);
  }

  clauses.push(`GROUP BY ${Incidents.field(Sources.foreignKey())}`);
  clauses.push(`ORDER BY ${Incidents.field(Sources.foreignKey())} ASC`);

  return { clauses, params, id };
};

module.exports = {
  getStatsQuery,
};
