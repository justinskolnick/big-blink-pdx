const { percentage } = require('../lib/number');

const { getStatsQuery } = require('./queries/stats');

const db = require('./db');
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
  const hasEntityId = Boolean(entityId);
  const hasPersonId = Boolean(personId);
  const hasSourceId = Boolean(sourceId);

  const incidentTotal = await incidents.getTotal();
  let firstAndLastIncidents;
  let total;

  if (hasEntityId) {
    firstAndLastIncidents = await incidents.getFirstAndLastDates({ entityId });
    total = await incidents.getTotal({ entityId });
  }

  if (hasPersonId) {
    firstAndLastIncidents = await incidents.getFirstAndLastDates({ personId });
    total = await incidents.getTotal({ personId });
  }

  if (hasSourceId) {
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
  const hasEntityId = Boolean(entityId);
  const hasPersonId = Boolean(personId);
  const hasSourceId = Boolean(sourceId);

  let paginationTotal;

  if (hasEntityId) {
    paginationTotal = await incidents.getTotal({
      dateOn,
      dateRangeFrom,
      dateRangeTo,
      entityId,
      quarterSourceId,
      withEntityId,
      withPersonId,
    });
  } else if (hasPersonId) {
    paginationTotal = await incidents.getTotal({
      dateOn,
      dateRangeFrom,
      dateRangeTo,
      personId,
      quarterSourceId,
      withEntityId,
      withPersonId,
    });
  } else if (hasSourceId) {
    paginationTotal = await incidents.getTotal({
      dateOn,
      dateRangeFrom,
      dateRangeTo,
      sourceId,
      withEntityId,
      withPersonId,
    });
  } else {
    paginationTotal = await incidents.getTotal({
      dateOn,
      dateRangeFrom,
      dateRangeTo,
    });
  }

  return paginationTotal;
};

module.exports = {
  getIncidentsStats,
  getPaginationStats,
  getStats,
};
