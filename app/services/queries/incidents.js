const { SORT_ASC, SORT_DESC } = require('../../config/constants');

const queryHelper = require('../../helpers/query');

const Entities = require('../tables/entities');
const Incidents = require('../tables/incidents');
const IncidentAttendees = require('../tables/incident-attendees');
const People = require('../tables/people');
const Sources = require('../tables/data-sources');

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
    const segments = Incidents.dateRangeFields().map(fieldName => (
      `${fieldName} = ?`
    )).join(' OR ');

    conditions.push(`(${segments})`);
    params.push(dateOn, dateOn);
  } else if (hasDateRange) {
    const segments = Incidents.dateRangeFields().map(fieldName => (
      `${fieldName} BETWEEN ? AND ?`
    )).join(' OR ');

    conditions.push(`(${segments})`);
    params.push(dateRangeFrom, dateRangeTo, dateRangeFrom, dateRangeTo);
  } else if (hasYear) {
    conditions.push(`SUBSTRING(${Incidents.field('contact_date')}, 1, 4) = ?`);
    params.push(year);
  }

  return { conditions, params };
};

const buildIntersectionQuery = (options = {}) => {
  const { id, role } = options;

  const hasPersonId = Boolean(id);
  const hasRole = Boolean(role);

  const clauses = [];
  const conditions = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(IncidentAttendees.field(Incidents.foreignKey()));
  clauses.push(`FROM ${IncidentAttendees.tableName()}`);

  if (hasPersonId) {
    clauses.push('WHERE');
    conditions.push(`${IncidentAttendees.field(People.foreignKey())} = ?`);
    params.push(id);

    if (hasRole) {
      conditions.push(`${IncidentAttendees.field('role')} = ?`);
      params.push(role);
    }
  }

  clauses.push(...queryHelper.joinConditions(conditions));

  return { clauses, params };
};

const buildQuery = (options = {}) => {
  const {
    dateOn,
    dateRangeFrom,
    dateRangeTo,
    entityId,
    includeTotalOnly = false,
    page,
    people = [],
    perPage,
    personId,
    primaryKeyOnly = false,
    quarterSourceId,
    role,
    sort = SORT_ASC,
    sourceId,
    withEntityId,
    withPersonId,
    year,
  } = options;
  const personIds = [personId, withPersonId].filter(Boolean);

  const hasDateOn = Boolean(dateOn);
  const hasDateRange = Boolean(dateRangeFrom && dateRangeTo);
  const hasEntityId = Boolean(entityId || withEntityId);
  const hasPeople = people?.length > 0;
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
  clauses.push('DISTINCT');

  if (primaryKeyOnly) {
    clauses.push(Incidents.primaryKey());
  } else if (includeTotalOnly) {
    clauses.push(`COUNT(${Incidents.primaryKey()}) AS total`);
  } else {
    clauses.push(Incidents.fields().join(', '));
  }

  clauses.push(`FROM ${Incidents.tableName()}`);

  if (hasPersonId || hasRole) {
    clauses.push(queryHelper.leftJoin(Incidents, IncidentAttendees));
  }

  if (hasForeignKeyOption || hasDateOption) {
    clauses.push('WHERE');

    if (hasForeignKeyOption) {
      if (hasEntityId) {
        conditions.push(`${Incidents.field(Entities.foreignKey())} = ?`);
        params.push(entityId || withEntityId);
      }

      if (hasSourceId) {
        conditions.push(`${Incidents.field(Sources.foreignKey())} = ?`);
        params.push(sourceId || quarterSourceId);
      }

      if (hasPersonId) {
        conditions.push(`${IncidentAttendees.field(People.foreignKey())} = ?`);
        params.push(personIds.at(0));
      }

      if (hasRole) {
        conditions.push(`${IncidentAttendees.field('role')} = ?`);
        params.push(role);
      }

      if (hasPeople || hasPersonIds || hasPersonId) {
        const subqueryStatements = [];
        const subqueryClauses = [];
        const subqueryConditions = [];
        const intersections = [];

        if (hasPeople) {
          if (hasPersonId) {
            intersections.push(buildIntersectionQuery({ id: personIds.at(0) }));
          }

          intersections.push(...people.map(buildIntersectionQuery));
        }

        if (hasPersonIds) {
          intersections.push(...personIds.map(pId =>
            buildIntersectionQuery({ id: pId })
          ));
        }

        if (intersections.length) {
          intersections.forEach(intersection => {
            subqueryStatements.push(intersection.clauses.join(' '));
            subqueryClauses.push(...intersection.params);
          });

          subqueryConditions.push(`${Incidents.primaryKey()} IN (${subqueryStatements.join(' INTERSECT ')})`);

          conditions.push(...subqueryConditions);
          params.push(...subqueryClauses);
        }
      }
    }

    if (hasDateOption) {
      const dateConditions = buildDateConditions(options);

      conditions.push(...dateConditions.conditions);
      params.push(...dateConditions.params);
    }
  }

  clauses.push(...queryHelper.joinConditions(conditions));

  if (!primaryKeyOnly && !includeTotalOnly) {
    if (hasPeople || hasPersonIds) {
      clauses.push('GROUP BY');
      clauses.push(Incidents.primaryKey());
    }

    clauses.push('ORDER BY');
    clauses.push(`${Incidents.field('contact_date')}`);
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
  clauses.push(`${Incidents.fields().join(', ')}, ${Entities.field('name')} AS entity_name`);
  clauses.push(`FROM ${Incidents.tableName()}`);
  clauses.push(queryHelper.leftJoin(Incidents, Entities, true));
  clauses.push(`WHERE ${Incidents.primaryKey()} = ?`);
  clauses.push('LIMIT 1');

  params.push(id);

  return { clauses, params };
};

const getBoundaryDateSubquery = () => {
  const clauses = [];

  clauses.push('SELECT');
  clauses.push(Incidents.fields().join(', '));
  clauses.push(`FROM ${Incidents.tableName()}`);
  clauses.push(queryHelper.leftJoin(Incidents, Sources, true));

  return clauses;
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

  [SORT_ASC, SORT_DESC].forEach(sort => {
    const segment = [];
    const conditions = [];

    segment.push(getBoundaryDateSubquery().join(' '));
    conditions.push(`SUBSTRING(${Incidents.field('contact_date')}, 1, 4) = ${Sources.field('year')}`);

    if (hasEntityId) {
      conditions.push(`${Incidents.field(Entities.foreignKey())} = ?`);
      params.push(entityId);
    }

    if (hasPersonId) {
      segment.push(queryHelper.leftJoin(Incidents, IncidentAttendees));
      conditions.push(`${IncidentAttendees.field(People.foreignKey())} = ?`);
      params.push(personId);
    }

    if (hasSourceId) {
      conditions.push(`${Incidents.field(Sources.foreignKey())} = ?`);
      params.push(sourceId);
    }

    segment.push('WHERE');
    segment.push(...queryHelper.joinConditions(conditions));
    segment.push('ORDER BY');
    segment.push(Incidents.field('contact_date'));
    segment.push(sort);
    segment.push('LIMIT 1');

    segments.push(segment.join(' '));
  });

  clauses.push(segments.map(segment => '(' + segment + ')').join(' UNION '));

  return { clauses, params };
};

const getTotalQuery = (options = {}) => buildQuery({
  ...options,
  includeTotalOnly: true,
});

module.exports = {
  buildDateConditions,
  getAllQuery,
  getAtIdQuery,
  getFirstAndLastDatesQuery,
  getTotalQuery,
};
