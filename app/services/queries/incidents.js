const { SORT_ASC, SORT_DESC } = require('../../config/constants');

const queryHelper = require('../../helpers/query');
const Entity = require('../../models/entity');
const Incident = require('../../models/incident');
const IncidentAttendee = require('../../models/incident-attendee');
const Source = require('../../models/source');

const buildQuery = (options = {}) => {
  const {
    dateOn,
    dateRangeFrom,
    dateRangeTo,
    page,
    perPage,
    sourceId,
    personId,
    entityId,
    quarterSourceId,
    sort = SORT_ASC,
    totalOnly = false,
    withEntityId,
    withPersonId,
    year,
  } = options;
  const hasDateOn = Boolean(dateOn);
  const hasDateRange = Boolean(dateRangeFrom && dateRangeTo);
  const hasEntityId = Boolean(entityId || withEntityId);
  const hasPersonId = Boolean(personId || withPersonId);
  const hasSourceId = Boolean(sourceId || quarterSourceId);
  const hasYear = Boolean(year);

  const hasForeignKeyOption = hasEntityId || hasPersonId || hasSourceId;
  const hasDateOption = hasDateOn || hasDateRange || hasYear;

  const clauses = [];
  const conditions = [];
  const params = [];

  clauses.push('SELECT');

  if (totalOnly) {
    clauses.push(`COUNT(${Incident.primaryKey()}) AS total`);
  } else {
    clauses.push(Incident.fields().join(', '));
  }

  clauses.push(`FROM ${Incident.tableName}`);

  if (hasPersonId) {
    clauses.push(`LEFT JOIN ${IncidentAttendee.tableName}`);
    clauses.push(`ON ${Incident.primaryKey()} = ${IncidentAttendee.field('incident_id')}`);
  }

  if (hasForeignKeyOption || hasDateOption) {
    clauses.push('WHERE');

    if (hasForeignKeyOption) {
      if (hasEntityId) {
        conditions.push(`${Incident.field('entity_id')} = ?`);
        params.push(entityId || withEntityId);
      }

      if (hasPersonId) {
        conditions.push(`${IncidentAttendee.field('person_id')} = ?`);
        params.push(personId || withPersonId);
      }

      if (hasSourceId) {
        conditions.push(`${Incident.field('data_source_id')} = ?`);
        params.push(sourceId || quarterSourceId);
      }
    }

    if (hasDateOn) {
      const dateClauseSegments = Incident.dateRangeFields().map(fieldName => (
        `${fieldName} = ?`
      )).join(' OR ');

      conditions.push(`(${dateClauseSegments})`);
      params.push(dateOn, dateOn);
    } else if (hasDateRange) {
      const dateClauseSegments = Incident.dateRangeFields().map(fieldName => (
        `${fieldName} BETWEEN ? AND ?`
      )).join(' OR ');

      conditions.push(`(${dateClauseSegments})`);
      params.push(dateRangeFrom, dateRangeTo, dateRangeFrom, dateRangeTo);
    } else if (hasYear) {
      conditions.push(`SUBSTRING(${Incident.field('contact_date')}, 1, 4) = ?`);
      params.push(year);
    }
  }

  queryHelper.joinConditions(conditions).forEach(condition => {
    clauses.push(condition);
  });

  if (!totalOnly) {
    clauses.push('ORDER BY');
    clauses.push(`${Incident.field('contact_date')}`);
    clauses.push(sort);

    if (page && perPage) {
      const offset = queryHelper.getOffset(page, perPage);

      clauses.push('LIMIT ?,?');
      params.push(offset, perPage);
    }
  }

  return { clauses, params };
};

const getAllQuery = (options = {}) => buildQuery(options);

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

const getFirstAndLastDatesQuery = (options = {}) => {
  const {
    entityId,
    personId,
    sourceId,
  } = options;
  const hasEntityId = Boolean(entityId);
  const hasPersonId = Boolean(personId);
  const hasSourceId = Boolean(sourceId);

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

    if (hasEntityId) {
      conditions.push(`${Incident.tableName}.entity_id = ?`);
      params.push(entityId);
    }

    if (hasPersonId) {
      segment.push(`LEFT JOIN ${IncidentAttendee.tableName} ON ${IncidentAttendee.field('incident_id')} = ${Incident.primaryKey()}`);
      conditions.push(`${IncidentAttendee.field('person_id')} = ?`);
      params.push(personId);
    }

    if (hasSourceId) {
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

const getTotalQuery = (options = {}) => {
  options.totalOnly = true;

  return buildQuery(options);
};

module.exports = {
  getAllQuery,
  getAtIdQuery,
  getFirstAndLastDatesQuery,
  getTotalQuery,
};
