const paramHelper = require('../helpers/param');
const queryHelper = require('../helpers/query');
const Entity = require('../models/entity');
const Incident = require('../models/incident');
const IncidentAttendee = require('../models/incident-attendee');
const Source = require('../models/source');
const db = require('../services/db');

const { SORT_ASC, SORT_DESC } = paramHelper;

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
  const hasEntityId = Boolean(entityId || withEntityId);
  const hasPersonId = Boolean(personId || withPersonId);
  const hasSourceId = Boolean(sourceId || quarterSourceId);

  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(Incident.fields().join(', '));
  clauses.push(`FROM ${Incident.tableName}`);

  if (hasPersonId) {
    clauses.push(`LEFT JOIN ${IncidentAttendee.tableName} ON ${Incident.primaryKey()} = ${IncidentAttendee.field('incident_id')}`);
  }

  if (sourceId || entityId || personId) {
    clauses.push('WHERE');
  }

  if (hasEntityId) {
    clauses.push(`${Incident.field('entity_id')} = ?`);
    params.push(entityId || withEntityId);

    if (hasPersonId || hasSourceId) {
      clauses.push('AND');
    }
  }

  if (hasPersonId) {
    clauses.push(`${IncidentAttendee.field('person_id')} = ?`);
    params.push(personId || withPersonId);

    if (hasSourceId) {
      clauses.push('AND');
    }
  }

  if (hasSourceId) {
    clauses.push(`${Incident.field('data_source_id')} = ?`);
    params.push(sourceId || quarterSourceId);
  }

  clauses.push('ORDER BY');
  clauses.push(`${Incident.field('contact_date')}`);
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

  return results.map(result => new Incident(result));
};

const getAtIdQuery = (id) => {
  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(`${Incident.fields().join(', ')}, ${Entity.field('name')} AS entity_name`);
  clauses.push(`FROM ${Incident.tableName}`);
  clauses.push(`LEFT JOIN ${Entity.tableName} ON ${Entity.primaryKey()} = ${Incident.field('entity_id')}`);
  clauses.push(`WHERE ${Incident.primaryKey()} = ?`);
  clauses.push('LIMIT 1');

  params.push(id);

  return { clauses, params };
};

const getAtId = async (id) => {
  const { clauses, params } = getAtIdQuery(id);
  const result = await db.get(clauses, params);

  return new Incident(result);
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
    Incident.fields().join(', '),
    `FROM ${Incident.tableName}`,
    `LEFT JOIN ${Source.tableName} ON ${Incident.field('data_source_id')} = ${Source.primaryKey()}`
  ].join(' ');

  [SORT_ASC, SORT_DESC].forEach(sort => {
    const segment = [];
    const conditions = [];

    segment.push(select);
    conditions.push(`SUBSTRING(${Incident.field('contact_date')}, 1, 4) = ${Source.field('year')}`);

    if (entityId) {
      conditions.push(`${Incident.tableName}.entity_id = ?`);
      params.push(entityId);
    }

    if (personId) {
      segment.push(`LEFT JOIN ${IncidentAttendee.tableName} ON ${IncidentAttendee.field('incident_id')} = ${Incident.primaryKey()}`);
      conditions.push(`${IncidentAttendee.field('person_id')} = ?`);
      params.push(personId);
    }

    if (sourceId) {
      conditions.push(`${Incident.field('data_source_id')} = ?`);
      params.push(sourceId);
    }

    segment.push('WHERE');
    segment.push(conditions.join(' AND '));
    segment.push('ORDER BY');
    segment.push(Incident.field('contact_date'));
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

  const [first, last] = results.map(result => {
    const incident = new Incident(result);

    return incident.adapted;
  });

  return {
    first,
    last,
  };
};

const getTotalQuery = (options = {}) => {
  const { sourceId, entityId, quarterSourceId, withEntityId, withPersonId } = options;
  const hasSourceId = Boolean(sourceId || quarterSourceId);
  const hasEntityId = Boolean(entityId || withEntityId);

  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(`COUNT(${Incident.primaryKey()}) AS total FROM ${Incident.tableName}`);

  if (hasSourceId || hasEntityId) {
    if (withPersonId) {
      clauses.push(`LEFT JOIN ${IncidentAttendee.tableName} ON ${Incident.primaryKey()} = ${IncidentAttendee.field('incident_id')}`);
    }

    clauses.push('WHERE');
  }

  if (hasSourceId) {
    clauses.push(`${Incident.field('data_source_id')} = ?`);
    params.push(sourceId || quarterSourceId);
  }

  if (hasSourceId && hasEntityId) {
    clauses.push('AND');
  }

  if (hasEntityId) {
    clauses.push(`${Incident.field('entity_id')} = ?`);
    params.push(entityId || withEntityId);
  }

  if ((hasSourceId || hasEntityId) && withPersonId) {
    clauses.push('AND');
    clauses.push(`${IncidentAttendee.field('person_id')} = ?`);
    params.push(withPersonId);
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
