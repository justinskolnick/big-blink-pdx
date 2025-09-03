const { SORT_ASC, SORT_DESC } = require('../../config/constants');

const queryHelper = require('../../helpers/query');

const Entity = require('../../models/entity');
const Incident = require('../../models/incident');
const IncidentAttendee = require('../../models/incident-attendee');
const Person = require('../../models/person');
const Source = require('../../models/source');

const buildDateConditions = (options = {}) => {
  const {
    dateOn,
    dateRangeFrom,
    dateRangeTo,
    year,
  } = options;
  const hasDateOn = Boolean(dateOn);
  const hasDateRange = Boolean(dateRangeFrom && dateRangeTo);
  const hasYear = Boolean(year);

  const conditions = [];
  const params = [];

  if (hasDateOn) {
    const segments = Incident.dateRangeFields().map(fieldName => (
      `${fieldName} = ?`
    )).join(' OR ');

    conditions.push(`(${segments})`);
    params.push(dateOn, dateOn);
  } else if (hasDateRange) {
    const segments = Incident.dateRangeFields().map(fieldName => (
      `${fieldName} BETWEEN ? AND ?`
    )).join(' OR ');

    conditions.push(`(${segments})`);
    params.push(dateRangeFrom, dateRangeTo, dateRangeFrom, dateRangeTo);
  } else if (hasYear) {
    conditions.push(`SUBSTRING(${Incident.field('contact_date')}, 1, 4) = ?`);
    params.push(year);
  }

  return { conditions, params };
};

const buildIntersectionQuery = (options = {}) => {
  const { personId } = options;

  const hasPersonId = Boolean(personId);

  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(IncidentAttendee.field(Incident.foreignKey()));
  clauses.push(`FROM ${IncidentAttendee.tableName}`);

  if (hasPersonId) {
    clauses.push('WHERE');
    clauses.push(`${IncidentAttendee.field(Person.foreignKey())} = ?`);

    params.push(personId);
  }


  return { clauses, params };
};

const buildQuery = (options = {}) => {
  const {
    dateOn,
    dateRangeFrom,
    dateRangeTo,
    entityId,
    page,
    perPage,
    personId,
    primaryKeyOnly = false,
    quarterSourceId,
    role,
    sort = SORT_ASC,
    sourceId,
    totalOnly = false,
    withEntityId,
    withPersonId,
    year,
  } = options;
  const personIds = [personId, withPersonId].filter(Boolean);

  const hasDateOn = Boolean(dateOn);
  const hasDateRange = Boolean(dateRangeFrom && dateRangeTo);
  const hasEntityId = Boolean(entityId || withEntityId);
  const hasPersonId = personIds.length > 0;
  const hasPersonIds = personIds.length > 1;
  const hasRole = Boolean(role);
  const hasSourceId = Boolean(sourceId || quarterSourceId);
  const hasYear = Boolean(year);

  const hasForeignKeyOption = hasEntityId || hasPersonId || hasSourceId;
  const hasDateOption = hasDateOn || hasDateRange || hasYear;

  const clauses = [];
  const conditions = [];
  const params = [];

  clauses.push('SELECT');

  if (primaryKeyOnly) {
    clauses.push(Incident.primaryKey());
  } else if (totalOnly) {
    clauses.push(`COUNT(${Incident.primaryKey()}) AS total`);
  } else {
    clauses.push(Incident.fields().join(', '));
  }

  clauses.push(`FROM ${Incident.tableName}`);

  if (hasPersonId || hasRole) {
    clauses.push(`LEFT JOIN ${IncidentAttendee.tableName}`);
    clauses.push(`ON ${Incident.primaryKey()} = ${IncidentAttendee.field(Incident.foreignKey())}`);
  }

  if (hasForeignKeyOption || hasDateOption) {
    clauses.push('WHERE');

    if (hasForeignKeyOption) {
      if (hasEntityId) {
        conditions.push(`${Incident.field(Entity.foreignKey())} = ?`);
        params.push(entityId || withEntityId);
      }

      if (hasSourceId) {
        conditions.push(`${Incident.field(Source.foreignKey())} = ?`);
        params.push(sourceId || quarterSourceId);
      }

      if (hasPersonId) {
        conditions.push(`${IncidentAttendee.field(Person.foreignKey())} = ?`);
        params.push(personIds.at(0));
      }

      if (hasRole) {
        conditions.push(`${IncidentAttendee.field('role')} = ?`);
        params.push(role);
      }

      if (hasPersonIds) {
        const statements = [];

        personIds.forEach(pId => {
          const intersection = buildIntersectionQuery({ personId: pId });

          statements.push(intersection.clauses.join(' '));
          params.push(...intersection.params);
        });

        conditions.push(`${Incident.primaryKey()} IN (${statements.join(' INTERSECT ')})`);
      }
    }

    if (hasDateOption) {
      const dateConditions = buildDateConditions(options);

      conditions.push(...dateConditions.conditions);
      params.push(...dateConditions.params);
    }
  }

  clauses.push(...queryHelper.joinConditions(conditions));

  if (!primaryKeyOnly && !totalOnly) {
    if (hasPersonIds) {
      clauses.push('GROUP BY');
      clauses.push(Incident.primaryKey());
    }

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
  clauses.push(`LEFT JOIN ${Entity.tableName} ON ${Entity.primaryKey()} = ${Incident.field(Entity.foreignKey())}`);
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
    `LEFT JOIN ${Source.tableName} ON ${Incident.field(Source.foreignKey())} = ${Source.primaryKey()}`
  ].join(' ');

  [SORT_ASC, SORT_DESC].forEach(sort => {
    const segment = [];
    const conditions = [];

    segment.push(select);
    conditions.push(`SUBSTRING(${Incident.field('contact_date')}, 1, 4) = ${Source.field('year')}`);

    if (hasEntityId) {
      conditions.push(`${Incident.field(Entity.foreignKey())} = ?`);
      params.push(entityId);
    }

    if (hasPersonId) {
      segment.push(`LEFT JOIN ${IncidentAttendee.tableName} ON ${IncidentAttendee.field(Incident.foreignKey())} = ${Incident.primaryKey()}`);
      conditions.push(`${IncidentAttendee.field(Person.foreignKey())} = ?`);
      params.push(personId);
    }

    if (hasSourceId) {
      conditions.push(`${Incident.field(Source.foreignKey())} = ?`);
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
  buildDateConditions,
  getAllQuery,
  getAtIdQuery,
  getFirstAndLastDatesQuery,
  getTotalQuery,
};
