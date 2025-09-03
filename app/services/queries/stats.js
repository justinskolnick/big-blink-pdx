const Entity = require('../../models/entity');
const Incident = require('../../models/incident');
const IncidentAttendee = require('../../models/incident-attendee');
const Person = require('../../models/person');
const Source = require('../../models/source');

const getStatsQuery = (options = {}) => {
  const { entityId, personId } = options;

  const clauses = [];
  const columns = [];
  const params = [];
  let id;

  clauses.push('SELECT');
  columns.push(
    `${Incident.field(Source.foreignKey())}`,
    `COUNT(${Incident.primaryKey()}) AS total`,
  );

  clauses.push(columns.join(', '));
  clauses.push(`FROM ${Incident.tableName}`);

  if (entityId) {
    id = entityId;

    clauses.push(`WHERE ${Incident.field(Entity.foreignKey())} = ?`);
    params.push(entityId);
  } else if (personId) {
    id = personId;

    clauses.push(`WHERE ${Incident.primaryKey()} IN (SELECT ${Incident.foreignKey()} FROM ${IncidentAttendee.tableName} WHERE ${Person.foreignKey()} = ?)`);
    params.push(personId);
  }

  clauses.push(`GROUP BY ${Incident.field(Source.foreignKey())}`);
  clauses.push(`ORDER BY ${Incident.field(Source.foreignKey())} ASC`);

  return { clauses, params, id };
};

module.exports = {
  getStatsQuery,
};
