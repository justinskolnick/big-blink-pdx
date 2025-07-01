const {
  SORT_ASC,
  SORT_BY_NAME,
  SORT_BY_TOTAL,
  SORT_DESC,
} = require('../../config/constants');

const queryHelper = require('../../helpers/query');
const Entity = require('../../models/entity');
const Incident = require('../../models/incident');

const buildQuery = (options = {}) => {
  const {
    dateRangeFrom,
    dateRangeTo,
    includeCount = false,
    limit,
    page,
    perPage,
    sort,
    sortBy = SORT_BY_NAME,
    totalOnly = false,
    year,
  } = options;
  const hasDateRange = Boolean(dateRangeFrom && dateRangeTo);
  const hasLimit = Boolean(limit);
  const hasPage = Boolean(page);
  const hasPerPage = Boolean(perPage);
  const hasYear = Boolean(year);

  const clauses = [];
  const selections = [];
  const params = [];

  clauses.push('SELECT');

  if (totalOnly) {
    clauses.push(`COUNT(${Entity.primaryKey()}) AS total`);
  } else {
    selections.push(...Entity.fields());

    if (includeCount) {
      selections.push(`COUNT(${Incident.primaryKey()}) AS total`);
    }

    if (!sortBy || sortBy === SORT_BY_NAME) {
      selections.push(`CASE WHEN ${Entity.field('name')} LIKE 'The %' THEN TRIM(SUBSTR(${Entity.field('name')} FROM 4)) ELSE ${Entity.field('name')} END AS sort_name`);
    }

    clauses.push(selections.join(', '));
  }

  clauses.push(`FROM ${Entity.tableName}`);

  if (includeCount || hasDateRange || hasYear) {
    clauses.push(`LEFT JOIN ${Incident.tableName}`);
    clauses.push(`ON ${Incident.field('entity_id')} = ${Entity.primaryKey()}`);

    if (hasDateRange || hasYear) {
      clauses.push('WHERE');

      if (hasDateRange) {
        const dateClauseSegments = Incident.dateRangeFields().map(fieldName => (
          `${fieldName} BETWEEN ? AND ?`
        )).join(' OR ');

        clauses.push(`(${dateClauseSegments})`);
        params.push(dateRangeFrom, dateRangeTo, dateRangeFrom, dateRangeTo);
      } else if (hasYear) {
        clauses.push(`SUBSTRING(${Incident.field('contact_date')}, 1, 4) = ?`);
        params.push(year);
      }
    }

    clauses.push(`GROUP BY ${Entity.primaryKey()}`);
  }

  if (!totalOnly) {
    clauses.push('ORDER BY');

    if (includeCount && sortBy === SORT_BY_TOTAL) {
      clauses.push(`total ${sort || SORT_DESC}`);
    } else {
      clauses.push(`sort_name ${sort || SORT_ASC}`);
    }
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

  return { clauses, params };
};

const getAllQuery = (options = {}) => buildQuery(options);

const getAtIdQuery = (id) => {
  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(Entity.fields().join(', '));
  clauses.push(`FROM ${Entity.tableName}`);
  clauses.push(`WHERE ${Entity.field('id')} = ?`);
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
