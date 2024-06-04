const { percentage } = require('../lib/number');
const db = require('../services/db');
const Incident = require('../models/incident');
const IncidentAttendee = require('../models/incident-attendee');
const incidents = require('../services/incidents');
const incidentAttendances = require('../services/incident-attendances');

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

const getStats = async (options = {}) => {
  const { clauses, params, id } = getStatsQuery(options);

  const results = await db.getAll(clauses, params);

  return results.map(result => ({
    dataSourceId: Number(result.data_source_id),
    id: Number(id),
    total: result.total,
  }));
};

const getIncidentsStats = async (options = {}) => {
  const {
    entityId,
    personId,
    sourceId,
    quarterSourceId,
    withEntityId,
    withPersonId,
  } = options;

  const incidentTotal = await incidents.getTotal();
  let firstAndLastIncidents;
  let paginationTotal;
  let total;

  if (entityId) {
    firstAndLastIncidents = await incidents.getFirstAndLastDates({ entityId });
    paginationTotal = await incidents.getTotal({ entityId, quarterSourceId, withEntityId, withPersonId });
    total = await incidents.getTotal({ entityId });
  }

  if (personId) {
    firstAndLastIncidents = await incidents.getFirstAndLastDates({ personId });
    paginationTotal = await incidentAttendances.getTotal({ personId, quarterSourceId, withEntityId, withPersonId });
    total = await incidentAttendances.getTotal({ personId });
  }

  if (sourceId) {
    firstAndLastIncidents = await incidents.getFirstAndLastDates({ sourceId });
    paginationTotal = await incidents.getTotal({ sourceId, withEntityId, withPersonId });
    total = await incidents.getTotal({ sourceId });
  }

  return {
    first: firstAndLastIncidents.first,
    last: firstAndLastIncidents.last,
    paginationTotal,
    percentage: percentage(total, incidentTotal),
    total,
  };
};

module.exports = {
  getIncidentsStats,
  getStats,
  getStatsQuery,
};
