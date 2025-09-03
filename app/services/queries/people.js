const { SORT_ASC, SORT_BY_TOTAL, SORT_DESC } = require('../../config/constants');

const queryHelper = require('../../helpers/query');
const Incident = require('../../models/incident');
const IncidentAttendee = require('../../models/incident-attendee');
const Person = require('../../models/person');

const { buildDateConditions } = require('./incidents');

const buildQuery = (options = {}) => {
  const {
    dateRangeFrom,
    dateRangeTo,
    includeCount = false,
    page,
    perPage,
    role,
    sort,
    sortBy,
    totalOnly = false,
    year,
  } = options;
  const hasDateRange = Boolean(dateRangeFrom && dateRangeTo);
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

  if (totalOnly) {
    clauses.push(`COUNT(DISTINCT(${Person.primaryKey()})) AS total`);
  } else {
    selections.push(...Person.fields());

    if (includeCount) {
      selections.push(`COUNT(${IncidentAttendee.primaryKey()}) AS total`);
    }

    clauses.push(selections.join(', '));
  }

  clauses.push(`FROM ${Person.tableName}`);

  if (includeCount || hasRole || hasDateOption) {
    clauses.push(`LEFT JOIN ${IncidentAttendee.tableName}`);
    clauses.push(`ON ${IncidentAttendee.field(Person.foreignKey())} = ${Person.primaryKey()}`);
  }

  if (hasDateOption) {
    clauses.push(`LEFT JOIN ${Incident.tableName}`);
    clauses.push(`ON ${Incident.primaryKey()} = ${IncidentAttendee.field(Incident.foreignKey())}`);
  }

  clauses.push('WHERE');

  conditions.push(`${Person.field('identical_id')} IS NULL`);

  if (includeCount || hasRole || hasDateOption) {
    if (hasRole) {
      conditions.push(`${IncidentAttendee.field('role')} = ?`);
      params.push(role);
    }

    if (hasDateOption) {
      const dateConditions = buildDateConditions(options);

      conditions.push(...dateConditions.conditions);
      params.push(...dateConditions.params);
    }
  }

  clauses.push(...queryHelper.joinConditions(conditions));

  if (includeCount || hasRole || hasDateOption) {
    if (!totalOnly) {
      clauses.push(`GROUP BY ${Person.primaryKey()}`);
    }
  }

  if (!totalOnly) {
    clauses.push('ORDER BY');

    if (includeCount && sortBy === SORT_BY_TOTAL) {
      clauses.push(`total ${sort || SORT_DESC}, ${Person.field('family')} ASC, ${Person.field('given')} ASC`);
    } else {
      clauses.push(`${Person.field('family')} ${sort || SORT_ASC}, ${Person.field('given')} ${sort || SORT_ASC}`);
    }

    if (hasPage && hasPerPage) {
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
  const selections = [];
  const params = [];

  clauses.push('SELECT');

  selections.push(...Person.fields());
  selections.push(`GROUP_CONCAT(distinct ${IncidentAttendee.field('role')}) AS roles`);

  clauses.push(selections.join(', '));

  clauses.push(`FROM ${Person.tableName}`);
  clauses.push(`LEFT JOIN ${IncidentAttendee.tableName} ON ${IncidentAttendee.field(Person.foreignKey())} = ${Person.primaryKey()}`);
  clauses.push(`WHERE ${Person.field('id')} = ?`);

  params.push(id);

  clauses.push('LIMIT 1');

  return { clauses, params };
};

const getTotalQuery = (options = {}) => {
  options.totalOnly = true;

  return buildQuery(options);
};

module.exports = {
  getAllQuery,
  getAtIdQuery,
  getTotalQuery,
};
