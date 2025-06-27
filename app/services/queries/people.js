const { SORT_ASC, SORT_BY_TOTAL, SORT_DESC } = require('../../config/constants');

const queryHelper = require('../../helpers/query');
const Incident = require('../../models/incident');
const IncidentAttendee = require('../../models/incident-attendee');
const Person = require('../../models/person');

const getAllQuery = (options = {}) => {
  const {
    dateRangeFrom,
    dateRangeTo,
    includeCount = false,
    page,
    perPage,
    role,
    sort,
    sortBy,
    year,
  } = options;
  const hasDateRange = Boolean(dateRangeFrom && dateRangeTo);
  const hasPage = Boolean(page);
  const hasPerPage = Boolean(perPage);
  const hasRole = Boolean(role);
  const hasYear = Boolean(year);

  const clauses = [];
  const selections = [];
  const params = [];

  clauses.push('SELECT');

  selections.push(...Person.fields());

  if (includeCount) {
    selections.push(`COUNT(${IncidentAttendee.primaryKey()}) AS total`);
  }

  clauses.push(selections.join(', '));
  clauses.push(`FROM ${Person.tableName}`);

  if (includeCount || hasRole || hasDateRange || hasYear) {
    clauses.push(`LEFT JOIN ${IncidentAttendee.tableName}`);
    clauses.push(`ON ${IncidentAttendee.field('person_id')} = ${Person.primaryKey()}`);
  }

  if (hasDateRange || hasYear) {
    clauses.push(`LEFT JOIN ${Incident.tableName}`);
    clauses.push(`ON ${Incident.primaryKey()} = ${IncidentAttendee.field('incident_id')}`);
  }

  clauses.push('WHERE');
  clauses.push(`${Person.field('identical_id')} IS NULL`);

  if (includeCount || hasRole || hasDateRange || hasYear) {
    if (hasRole) {
      clauses.push('AND');
      clauses.push(`${IncidentAttendee.field('role')} = ?`);
      params.push(role);
    }

    if (hasDateRange || hasYear) {
      clauses.push('AND');

      if (hasDateRange) {
        const dateFields = ['contact_date', 'contact_date_end'];
        const dateClauseSegments = [];

        dateFields.forEach(fieldName => {
          dateClauseSegments.push(`${Incident.field(fieldName)} BETWEEN ? AND ?`);
        });

        clauses.push(`(${dateClauseSegments.join(' OR ')})`);
        params.push(dateRangeFrom, dateRangeTo, dateRangeFrom, dateRangeTo);
      } else if (hasYear) {
        clauses.push(`SUBSTRING(${Incident.field('contact_date')}, 1, 4) = ?`);
        params.push(year);
      }
    }

    clauses.push(`GROUP BY ${Person.primaryKey()}`);
  }

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

  return { clauses, params };
};

const getAtIdQuery = (id) => {
  const clauses = [];
  const selections = [];
  const params = [];

  clauses.push('SELECT');

  selections.push(...Person.fields());
  selections.push(`GROUP_CONCAT(distinct ${IncidentAttendee.field('role')}) AS roles`);

  clauses.push(selections.join(', '));

  clauses.push(`FROM ${Person.tableName}`);
  clauses.push(`LEFT JOIN ${IncidentAttendee.tableName} ON ${IncidentAttendee.field('person_id')} = ${Person.primaryKey()}`);
  clauses.push(`WHERE ${Person.field('id')} = ?`);

  params.push(id);

  clauses.push('LIMIT 1');

  return { clauses, params };
};

const getTotalQuery = () => `SELECT COUNT(${Person.primaryKey()}) AS total FROM ${Person.tableName} WHERE ${Person.field('identical_id')} IS NULL`;

module.exports = {
  getAllQuery,
  getAtIdQuery,
  getTotalQuery,
};
