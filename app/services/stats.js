const { percentage } = require('../lib/number');
const db = require('../services/db');
const { TABLE: INCIDENTS_TABLE } = require('../models/incidents');
const { TABLE: INCIDENT_ATTENDEES_TABLE } = require('../models/incident-attendees');
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
    `${INCIDENTS_TABLE}.data_source_id`,
    `COUNT(${INCIDENTS_TABLE}.id) AS total`,
  );

  clauses.push(columns.join(', '));
  clauses.push(`FROM ${INCIDENTS_TABLE}`);

  if (entityId) {
    id = entityId;

    clauses.push(`WHERE ${INCIDENTS_TABLE}.entity_id = ?`);
    params.push(entityId);
  } else if (personId) {
    id = personId;

    clauses.push(`WHERE ${INCIDENTS_TABLE}.id IN (SELECT incident_id FROM ${INCIDENT_ATTENDEES_TABLE} WHERE person_id = ?)`);
    params.push(personId);
  }

  clauses.push(`GROUP BY ${INCIDENTS_TABLE}.data_source_id`);
  clauses.push(`ORDER BY ${INCIDENTS_TABLE}.data_source_id ASC`);

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
