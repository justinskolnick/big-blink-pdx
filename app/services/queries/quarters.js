const Quarter = require('../../models/quarter');

const buildQuery = (options = {}) => {
  const {
    quarter,
    limit,
    year,
  } = options;

  const hasQuarter = Boolean(quarter);
  const hasLimit = Boolean(limit);
  const hasYear = Boolean(year);

  const clauses = [];
  const selections = [];
  const params = [];

  clauses.push('SELECT');
  selections.push(...Quarter.fields());

  clauses.push(selections.join(', '));
  clauses.push(`FROM ${Quarter.tableName}`);

  if (hasQuarter || hasYear) {
    clauses.push('WHERE');
  }

  if (hasQuarter) {
    clauses.push(`${Quarter.field('quarter')} = ?`);
    params.push(quarter);
  }

  if (hasQuarter && hasYear) {
    clauses.push('AND');
  }

  if (hasYear) {
    clauses.push(`${Quarter.field('year')} = ?`);
    params.push(year);
  }

  clauses.push(`ORDER BY ${Quarter.tableName}.year ASC, ${Quarter.tableName}.quarter ASC`);


  if (hasLimit) {
    clauses.push('LIMIT ?');
    params.push(limit);
  }

  return { clauses, params };
};

const getQuarterQuery = (options = {}) => buildQuery({
  ...options,
  limit: 1,
});

const getAllQuery = (options = {}) => buildQuery(options);

module.exports = {
  getAllQuery,
  getQuarterQuery,
};
