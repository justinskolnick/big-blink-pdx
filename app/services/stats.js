const { percentage } = require('../lib/number');
const { getStatsQuery } = require('./queries/stats');
const db = require('./db');
const incidentAttendances = require('./incident-attendances');
const incidents = require('./incidents');

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
  } = options;

  const incidentTotal = await incidents.getTotal();
  let firstAndLastIncidents;
  let total;

  if (entityId) {
    firstAndLastIncidents = await incidents.getFirstAndLastDates({ entityId });
    total = await incidents.getTotal({ entityId });
  }

  if (personId) {
    firstAndLastIncidents = await incidents.getFirstAndLastDates({ personId });
    total = await incidentAttendances.getTotal({ personId });
  }

  if (sourceId) {
    firstAndLastIncidents = await incidents.getFirstAndLastDates({ sourceId });
    total = await incidents.getTotal({ sourceId });
  }

  return {
    first: firstAndLastIncidents.first,
    last: firstAndLastIncidents.last,
    percentage: percentage(total, incidentTotal),
    total,
  };
};

const getPaginationStats = async (options = {}) => {
  const {
    dateOn,
    dateRangeFrom,
    dateRangeTo,
    entityId,
    personId,
    sourceId,
    quarterSourceId,
    withEntityId,
    withPersonId,
  } = options;

  let paginationTotal;

  if (entityId) {
    paginationTotal = await incidents.getTotal({
      dateOn,
      dateRangeFrom,
      dateRangeTo,
      entityId,
      quarterSourceId,
      withEntityId,
      withPersonId,
    });
  }

  if (personId) {
    paginationTotal = await incidentAttendances.getTotal({
      dateOn,
      dateRangeFrom,
      dateRangeTo,
      personId,
      quarterSourceId,
      withEntityId,
      withPersonId,
    });
  }

  if (sourceId) {
    paginationTotal = await incidents.getTotal({
      dateOn,
      dateRangeFrom,
      dateRangeTo,
      sourceId,
      withEntityId,
      withPersonId,
    });
  }

  return paginationTotal;
};

module.exports = {
  getIncidentsStats,
  getPaginationStats,
  getStats,
};
