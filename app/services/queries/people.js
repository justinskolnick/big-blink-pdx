const { SORT_ASC, SORT_BY_TOTAL, SORT_DESC } = require('../../config/constants');

const queryHelper = require('../../helpers/query');

const Incidents = require('../tables/incidents');
const IncidentAttendees = require('../tables/incident-attendees');
const People = require('../tables/people');

const { buildDateConditions } = require('./incidents');

const buildQuery = (options = {}) => {
  const {
    dateRangeFrom,
    dateRangeTo,
    includeTotal = false,
    includeTotalOnly = false,
    limit,
    page,
    perPage,
    role,
    sort,
    sortBy,
    year,
  } = options;

  const hasDateRange = Boolean(dateRangeFrom && dateRangeTo);
  const hasLimit = Boolean(limit);
  const hasPage = Boolean(page);
  const hasPerPage = Boolean(perPage);
  const hasRole = Boolean(role);
  const hasYear = Boolean(year);

  const hasDateOption = hasDateRange || hasYear;

  const clauses = [];
  const conditions = [];
  const selections = [];
  const params = [];

  clauses.push('SELECT');

  if (includeTotalOnly) {
    clauses.push(`COUNT(DISTINCT(${People.primaryKey()})) AS total`);
  } else {
    selections.push(...People.fields());

    if (includeTotal) {
      selections.push(`COUNT(${IncidentAttendees.primaryKey()}) AS total`);
    }

    clauses.push(selections.join(', '));
  }

  clauses.push(`FROM ${People.tableName()}`);

  if (includeTotal || hasRole || hasDateOption) {
    clauses.push(queryHelper.leftJoin(People, IncidentAttendees));
  }

  if (hasDateOption) {
    clauses.push(`LEFT JOIN ${Incidents.tableName()} ON ${Incidents.primaryKey()} = ${IncidentAttendees.field(Incidents.foreignKey())}`);
  }

  clauses.push('WHERE');

  conditions.push(`${People.field('identical_id')} IS NULL`);

  if (includeTotal || hasRole || hasDateOption) {
    if (hasRole) {
      conditions.push(`${IncidentAttendees.field('role')} = ?`);
      params.push(role);
    }

    if (hasDateOption) {
      const dateConditions = buildDateConditions(options);

      conditions.push(...dateConditions.conditions);
      params.push(...dateConditions.params);
    }
  }

  clauses.push(...queryHelper.joinConditions(conditions));

  if (includeTotal || hasRole || hasDateOption) {
    if (!includeTotalOnly) {
      clauses.push(`GROUP BY ${People.primaryKey()}`);
    }
  }

  if (!includeTotalOnly) {
    clauses.push('ORDER BY');

    if (includeTotal && sortBy === SORT_BY_TOTAL) {
      clauses.push(`total ${sort || SORT_DESC}, ${People.field('family')} ASC, ${People.field('given')} ASC`);
    } else {
      clauses.push(`${People.field('family')} ${sort || SORT_ASC}, ${People.field('given')} ${sort || SORT_ASC}`);
    }

    if ((hasPage && hasPerPage) || hasLimit) {
      clauses.push('LIMIT ?,?');

      if (hasPage && hasPerPage) {
        const offset = queryHelper.getOffset(page, perPage);

        params.push(offset, perPage);
      } else if (hasLimit) {
        params.push(0, limit);
      }
    }
  }

  return { clauses, params };
};

const getAllQuery = (options = {}) => buildQuery(options);

const getAtIdQuery = (id) => {
  const clauses = [];
  const selections = [];
  const params = [];

  clauses.push('SELECT');

  selections.push(...People.fields());
  selections.push(`GROUP_CONCAT(distinct ${IncidentAttendees.field('role')}) AS roles`);

  clauses.push(selections.join(', '));

  clauses.push(`FROM ${People.tableName()}`);
  clauses.push(queryHelper.leftJoin(People, IncidentAttendees));
  clauses.push(`WHERE ${People.field('id')} = ?`);

  params.push(id);

  clauses.push('LIMIT 1');

  return { clauses, params };
};

const getTotalQuery = (options = {}) => buildQuery({
  ...options,
  includeTotalOnly: true,
});

module.exports = {
  getAllQuery,
  getAtIdQuery,
  getTotalQuery,
};
