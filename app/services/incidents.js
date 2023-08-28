const dateHelper = require('../helpers/date');
const paramHelper = require('../helpers/param');
const queryHelper = require('../helpers/query');
const { TABLE: ENTITIES_TABLE } = require('../models/entities');
const { TABLE, FIELDS } = require('../models/incidents');
const { TABLE: INCIDENT_ATTENDEES_TABLE } = require('../models/incident-attendees');
const { TABLE: SOURCES_TABLE } = require('../models/sources');
const db = require('../services/db');

const { SORT_ASC, SORT_DESC } = paramHelper;

const adaptContactDate = str => dateHelper.formatDateString(str);

const adapt = (result) => ({
  id: result.id,
  entity: result.entity,
  entityId: result.entity_id,
  entityName: result.entity_name,
  contactDate: adaptContactDate(result.contact_date),
  contactType: result.contact_type,
  category: result.category,
  sourceId: result.data_source_id,
  topic: result.topic,
  officials: result.officials,
  lobbyists: result.lobbyists,
  notes: result.notes,
  raw: {
    officials: result.officials,
    lobbyists: result.lobbyists,
  },
});

const getAllQuery = (options = {}) => {
  const {
    page,
    perPage,
    sourceId,
    personId,
    entityId,
    quarterSourceId,
    sort = SORT_ASC,
    withEntityId,
    withPersonId,
  } = options;

  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(FIELDS.map(column => [TABLE, column].join('.')).join(', '));
  clauses.push(`FROM ${TABLE}`);

  if (sourceId) {
    if (withPersonId) {
      clauses.push(`LEFT JOIN ${INCIDENT_ATTENDEES_TABLE} ON ${TABLE}.id = ${INCIDENT_ATTENDEES_TABLE}.incident_id`);
      clauses.push('WHERE');
      clauses.push(`${TABLE}.data_source_id = ?`);
      clauses.push(`AND ${INCIDENT_ATTENDEES_TABLE}.person_id = ?`);
      params.push(sourceId, withPersonId);
    } else {
      clauses.push('WHERE');
      clauses.push(`${TABLE}.data_source_id = ?`);
      params.push(sourceId);
    }
  }

  if (entityId) {
    if (withPersonId) {
      clauses.push(`LEFT JOIN ${INCIDENT_ATTENDEES_TABLE} ON ${TABLE}.id = ${INCIDENT_ATTENDEES_TABLE}.incident_id`);
      clauses.push('WHERE');
      clauses.push(`${TABLE}.entity_id = ?`);
      clauses.push(`AND ${INCIDENT_ATTENDEES_TABLE}.person_id = ?`);
      params.push(entityId, withPersonId);
    } else {
      clauses.push('WHERE');
      clauses.push(`${TABLE}.entity_id = ?`);
      params.push(entityId);

      if (quarterSourceId) {
        clauses.push('AND');
        clauses.push(`${TABLE}.data_source_id = ?`);
        params.push(quarterSourceId);
      }
    }
  } else if (personId) {
    if (withEntityId) {
      clauses.push(`LEFT JOIN ${INCIDENT_ATTENDEES_TABLE} ON ${TABLE}.id = ${INCIDENT_ATTENDEES_TABLE}.incident_id`);
      clauses.push('WHERE');
      clauses.push(`${TABLE}.entity_id = ?`);
      clauses.push(`AND ${INCIDENT_ATTENDEES_TABLE}.person_id = ?`);
      params.push(withEntityId, personId);
    } else {
      clauses.push(`LEFT JOIN ${INCIDENT_ATTENDEES_TABLE} ON ${TABLE}.id = ${INCIDENT_ATTENDEES_TABLE}.incident_id`);
      clauses.push(`WHERE ${INCIDENT_ATTENDEES_TABLE}.person_id = ?`);
      params.push(personId);
    }
  }

  clauses.push('ORDER BY');
  clauses.push(`${TABLE}.contact_date`);
  clauses.push(sort);

  if (page && perPage) {
    const offset = queryHelper.getOffset(page, perPage);

    clauses.push('LIMIT ?,?');
    params.push(offset, perPage);
  }

  return { clauses, params };
};

const getAll = async (options = {}) => {
  const { clauses, params } = getAllQuery(options);
  const results = await db.getAll(clauses, params);

  return results.map(adapt);
};

const getAtIdQuery = (id) => {
  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(`${FIELDS.map(column => [TABLE, column].join('.')).join(', ')}, ${ENTITIES_TABLE}.name AS entity_name`);
  clauses.push(`FROM ${TABLE}`);
  clauses.push(`LEFT JOIN ${ENTITIES_TABLE} ON ${ENTITIES_TABLE}.id = ${TABLE}.entity_id`);
  clauses.push(`WHERE ${TABLE}.id = ?`);
  clauses.push('LIMIT 1');

  params.push(id);

  return { clauses, params };
};

const getAtId = async (id) => {
  const { clauses, params } = getAtIdQuery(id);
  const result = await db.get(clauses, params);

  return adapt(result);
};

const getFirstAndLastDatesQuery = (options = {}) => {
  const { entityId, personId, sourceId } = options;

  const segments = [];
  const clauses = [];
  const params = [];

  // The join with data_sources is here to filter anomalous dates out of the results set:
  // Each data sources represents a year and a quarter, so any date with a year outside of
  // the source's year is considered an anomaly

  const select = [
    'SELECT',
    FIELDS.map(column => [TABLE, column].join('.')).join(', '),
    `FROM ${TABLE}`,
    `LEFT JOIN ${SOURCES_TABLE} ON ${TABLE}.data_source_id = ${SOURCES_TABLE}.id`
  ].join(' ');

  [SORT_ASC, SORT_DESC].forEach(sort => {
    const segment = [];
    const conditions = [];

    segment.push(select);
    conditions.push(`SUBSTRING(${TABLE}.contact_date, 1, 4) = ${SOURCES_TABLE}.year`);

    if (entityId) {
      conditions.push(`${TABLE}.entity_id = ?`);
      params.push(entityId);
    }

    if (personId) {
      segment.push(`LEFT JOIN ${INCIDENT_ATTENDEES_TABLE} ON ${INCIDENT_ATTENDEES_TABLE}.incident_id = ${TABLE}.id`);
      conditions.push(`${INCIDENT_ATTENDEES_TABLE}.person_id = ?`);
      params.push(personId);
    }

    if (sourceId) {
      conditions.push(`${TABLE}.data_source_id = ?`);
      params.push(sourceId);
    }

    segment.push('WHERE');
    segment.push(conditions.join(' AND '));
    segment.push(`ORDER BY ${TABLE}.contact_date`);
    segment.push(sort);
    segment.push('LIMIT 1');

    segments.push(segment.join(' '));
  });

  clauses.push(segments.map(segment => '(' + segment + ')').join(' UNION '));

  return { clauses, params };
};

const getFirstAndLastDates = async (options = {}) => {
  const { clauses, params } = getFirstAndLastDatesQuery(options);
  const results = await db.getAll(clauses, params);

  const [first, last] = results.map(adapt);

  return {
    first,
    last,
  };
};

const getTotalQuery = (options = {}) => {
  const { sourceId, entityId, quarterSourceId, withEntityId, withPersonId } = options;

  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(`COUNT(${TABLE}.id) AS total FROM ${TABLE}`);

  if (sourceId) {
    if (withPersonId) {
      clauses.push(`LEFT JOIN ${INCIDENT_ATTENDEES_TABLE} ON ${TABLE}.id = ${INCIDENT_ATTENDEES_TABLE}.incident_id`);
      clauses.push('WHERE');
      clauses.push(`${TABLE}.data_source_id = ?`);
      clauses.push(`AND ${INCIDENT_ATTENDEES_TABLE}.person_id = ?`);
      params.push(sourceId, withPersonId);
    } else {
      clauses.push('WHERE');
      clauses.push(`${TABLE}.data_source_id = ?`);
      params.push(sourceId);
    }
  }

  if (entityId || withEntityId) {
    if (withPersonId) {
      clauses.push(`LEFT JOIN ${INCIDENT_ATTENDEES_TABLE} ON ${TABLE}.id = ${INCIDENT_ATTENDEES_TABLE}.incident_id`);
      clauses.push('WHERE');
      clauses.push(`${TABLE}.entity_id = ?`);
      clauses.push(`AND ${INCIDENT_ATTENDEES_TABLE}.person_id = ?`);
      params.push(entityId || withEntityId, withPersonId);
    } else {
      clauses.push('WHERE');
      clauses.push(`${TABLE}.entity_id = ?`);
      params.push(entityId || withEntityId);

      if (quarterSourceId) {
        clauses.push('AND');
        clauses.push(`${TABLE}.data_source_id = ?`);
        params.push(quarterSourceId);
      }
    }
  }

  return { clauses, params };
};

const getTotal = async (options = {}) => {
  const { clauses, params } = getTotalQuery(options);
  const result = await db.get(clauses, params);

  return result.total;
};

module.exports = {
  getAll,
  getAllQuery,
  getAtId,
  getAtIdQuery,
  getFirstAndLastDates,
  getFirstAndLastDatesQuery,
  getTotal,
  getTotalQuery,
};
