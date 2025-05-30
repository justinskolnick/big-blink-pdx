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
    const dateFields = ['contact_date', 'contact_date_end'];
    const dateClauseSegments = [];

    if (hasDateOn) {
      dateFields.forEach(fieldName => {
        dateClauseSegments.push(`${Incident.field(fieldName)} = ?`);
      });

      params.push(dateOn, dateOn);
    } else if (hasDateRange) {
      dateFields.forEach(fieldName => {
        dateClauseSegments.push(`${Incident.field(fieldName)} BETWEEN ? AND ?`);
      });

      params.push(dateRangeFrom, dateRangeTo, dateRangeFrom, dateRangeTo);
    }

    clauses.push(`(${dateClauseSegments.join(' OR ')})`);

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
  const {
    dateOn,
    dateRangeFrom,
    dateRangeTo,
    entityId,
    quarterSourceId,
    sourceId,
    withEntityId,
    withPersonId,
    year,
  } = options;
  const hasDateOn = Boolean(dateOn);
  const hasDateRange = Boolean(dateRangeFrom && dateRangeTo);
  const hasSourceId = Boolean(sourceId || quarterSourceId);
  const hasEntityId = Boolean(entityId || withEntityId);
  const hasWithPersonId = Boolean(withPersonId);
  const hasYear = Boolean(year);

  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(`COUNT(${Incident.primaryKey()}) AS total`);
  clauses.push(`FROM ${Incident.tableName}`);

  if (hasWithPersonId && (hasEntityId || hasSourceId)) {
    clauses.push(`LEFT JOIN ${IncidentAttendee.tableName}`);
    clauses.push(`ON ${Incident.primaryKey()} = ${IncidentAttendee.field('incident_id')}`);
  }

  if (hasSourceId || hasEntityId || hasDateOn || hasDateRange || hasYear) {
    clauses.push('WHERE');
  }

  if (hasSourceId || hasEntityId) {
    if (hasSourceId) {
      clauses.push(`${Incident.field('data_source_id')} = ?`);
      params.push(sourceId || quarterSourceId);

      if (hasEntityId) {
        clauses.push('AND');
      }
    }

    if (hasEntityId) {
      clauses.push(`${Incident.field('entity_id')} = ?`);
      params.push(entityId || withEntityId);
    }

    if (hasWithPersonId) {
      clauses.push('AND');
      clauses.push(`${IncidentAttendee.field('person_id')} = ?`);
      params.push(withPersonId);
    }

    if (hasDateOn || hasDateRange || hasYear) {
      clauses.push('AND');
    }
  }

  if (hasDateOn || hasDateRange) {
    const dateFields = ['contact_date', 'contact_date_end'];
    const dateClauseSegments = [];

    if (hasDateOn) {
      dateFields.forEach(fieldName => {
        dateClauseSegments.push(`${Incident.field(fieldName)} = ?`);
      });

      params.push(dateOn, dateOn);
    } else if (hasDateRange) {
      dateFields.forEach(fieldName => {
        dateClauseSegments.push(`${Incident.field(fieldName)} BETWEEN ? AND ?`);
      });

      params.push(dateRangeFrom, dateRangeTo, dateRangeFrom, dateRangeTo);
    }

    clauses.push(`(${dateClauseSegments.join(' OR ')})`);
  } else if (hasYear) {
    clauses.push(`SUBSTRING(${Incident.field('contact_date')}, 1, 4) = ?`);
    params.push(year);
  }

  return { clauses, params };
};

module.exports = {
  getAllQuery,
  getAtIdQuery,
  getFirstAndLastDatesQuery,
  getTotalQuery,
};
