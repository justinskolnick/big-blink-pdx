const {
  SORT_ASC,
  SORT_BY_NAME,
  SORT_BY_TOTAL,
  SORT_DESC,
} = require('../../config/constants');

const queryHelper = require('../../helpers/query');

const Entities = require('../tables/entities');
const Incidents = require('../tables/incidents');

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
    sort,
    sortBy = SORT_BY_NAME,
    year,
  } = options;

  const hasDateRange = Boolean(dateRangeFrom && dateRangeTo);
  const hasLimit = Boolean(limit);
  const hasPage = Boolean(page);
  const hasPerPage = Boolean(perPage);
  const hasYear = Boolean(year);

  const hasDateOption = hasDateRange || hasYear;

  const clauses = [];
  const conditions = [];
  const selections = [];
  const params = [];

  clauses.push('SELECT');

  if (includeTotalOnly) {
    clauses.push(`COUNT(DISTINCT(${Entities.primaryKey()})) AS total`);
  } else {
    selections.push(...Entities.fields());

    if (includeTotal) {
      selections.push(`COUNT(${Incidents.primaryKey()}) AS total`);
    }

    if (!sortBy || sortBy === SORT_BY_NAME) {
      selections.push(`CASE WHEN ${Entities.field('name')} LIKE 'The %' THEN TRIM(SUBSTR(${Entities.field('name')} FROM 4)) ELSE ${Entities.field('name')} END AS sort_name`);
    }

    clauses.push(selections.join(', '));
  }

  clauses.push(`FROM ${Entities.tableName()}`);

  if (includeTotal || hasDateOption) {
    clauses.push(queryHelper.leftJoin(Entities, Incidents));

    if (hasDateOption) {
      const dateConditions = buildDateConditions(options);

      conditions.push(...dateConditions.conditions);
      params.push(...dateConditions.params);

      clauses.push('WHERE');
    }

    clauses.push(...queryHelper.joinConditions(conditions));

    if (!includeTotalOnly) {
      clauses.push(`GROUP BY ${Entities.primaryKey()}`);
    }
  }

  if (!includeTotalOnly) {
    clauses.push('ORDER BY');

    if (includeTotal && sortBy === SORT_BY_TOTAL) {
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
  clauses.push(Entities.fields().join(', '));
  clauses.push(`FROM ${Entities.tableName()}`);
  clauses.push(`WHERE ${Entities.field('id')} = ?`);
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
