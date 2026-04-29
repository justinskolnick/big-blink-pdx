const { percentage } = require('../lib/number');

const {
  getContentTypesQuery,
  getStatsQuery,
} = require('./queries/stats');

const db = require('./db');
const incidents = require('./incidents');

const getEstimates = async (options = {}) => {
  const { clauses, params } = getContentTypesQuery(options);

  const results = await db.getAll(clauses, params);

  return results.reduce((all, result) => {
    const dataSourceId = Number(result.data_source_id);
    const total = result.contact_type.split('; ').length - 1;

    if (dataSourceId in all) {
      all[dataSourceId].total = all[dataSourceId].total + total;
    } else {
      all[dataSourceId] = {
        dataSourceId,
        total,
      };
    }

    return all;
  }, []).filter(Boolean);
};

const getEntries = async (options = {}) => {
  const { clauses, params, id } = getStatsQuery(options);

  const results = await db.getAll(clauses, params);

  return results.map(result => ({
    dataSourceId: Number(result.data_source_id),
    id: Number(id),
    total: result.total,
  }));
};

const getStats = async (options = {}) => {
  const results = await Promise.all([
    getEntries(options),
    getEstimates(options),
  ]);

  const [entries, estimates] = results;

  return {
    entries,
    estimates: estimates.map(estimate => {
      const entry = entries.find(e => e.dataSourceId === estimate.dataSourceId);
      let total = null;

      if (estimate.total > 0) {
        total = entry.total + estimate.total;
      }

      return {
        ...estimate,
        total,
      };
    }),
  };
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
  const paginationTotal = await incidents.getTotal(options);

  return paginationTotal;
};

module.exports = {
  getIncidentsStats,
  getPaginationStats,
  getStats,
};
