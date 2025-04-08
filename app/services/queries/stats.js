const Incident = require('../../models/incident');
const IncidentAttendee = require('../../models/incident-attendee');

const getStatsQuery = (options = {}) => {
  const { entityId, personId } = options;

  const clauses = [];
  const columns = [];
  const params = [];
  let id;

  clauses.push('SELECT');
  columns.push(
    `${Incident.field('data_source_id')}`,
    `COUNT(${Incident.primaryKey()}) AS total`,
  );

  clauses.push(columns.join(', '));
  clauses.push(`FROM ${Incident.tableName}`);

  if (entityId) {
    id = entityId;

    clauses.push(`WHERE ${Incident.field('entity_id')} = ?`);
    params.push(entityId);
  } else if (personId) {
    id = personId;

    clauses.push(`WHERE ${Incident.primaryKey()} IN (SELECT incident_id FROM ${IncidentAttendee.tableName} WHERE person_id = ?)`);
    params.push(personId);
  }

  clauses.push(`GROUP BY ${Incident.field('data_source_id')}`);
  clauses.push(`ORDER BY ${Incident.field('data_source_id')} ASC`);

  return { clauses, params, id };
};

module.exports = {
  getStatsQuery,
};
