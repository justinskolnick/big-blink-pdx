const { SORT_ASC, SORT_DESC } = require('../../config/constants');

const queryHelper = require('../../helpers/query');
const Entity = require('../../models/entity');
const Incident = require('../../models/incident');
const IncidentAttendee = require('../../models/incident-attendee');
const Source = require('../../models/source');

const getAllQuery = (options = {}) => {
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
    withEntityId,
    withPersonId,
  } = options;
  const hasDateOn = Boolean(dateOn);
  const hasDateRange = Boolean(dateRangeFrom && dateRangeTo);
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

  if (hasDateOn || hasDateRange || hasEntityId || hasPersonId || hasSourceId) {
    clauses.push('WHERE');
  }

  if (hasDateOn || hasDateRange) {
    if (hasDateOn) {
      clauses.push(`${Incident.field('contact_date')} = ?`);
      params.push(dateOn);
    } else if (hasDateRange) {
      clauses.push(`${Incident.field('contact_date')} BETWEEN ? AND ?`);
      params.push(dateRangeFrom, dateRangeTo);
    }

    if (hasEntityId || hasPersonId || hasSourceId) {
      clauses.push('AND');
    }
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

const getTotalQuery = (options = {}) => {
  const {
    dateOn,
    dateRangeFrom,
    dateRangeTo,
    entityId,
    quarterSourceId,
    sourceId,
    withEntityId,
    withPersonId,
  } = options;
  const hasDateOn = Boolean(dateOn);
  const hasDateRange = Boolean(dateRangeFrom && dateRangeTo);
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

  if (hasDateOn || hasDateRange) {
    if (hasSourceId || hasEntityId || withPersonId) {
      clauses.push('AND');
    }

    if (hasDateOn) {
      clauses.push(`${Incident.field('contact_date')} = ?`);
      params.push(dateOn);
    } else if (hasDateRange) {
      clauses.push(`${Incident.field('contact_date')} BETWEEN ? AND ?`);
      params.push(dateRangeFrom, dateRangeTo);
    }
  }

  return { clauses, params };
};

module.exports = {
  getAllQuery,
  getAtIdQuery,
  getFirstAndLastDatesQuery,
  getTotalQuery,
};
