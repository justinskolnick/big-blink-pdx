const Quarters = require('../tables/quarters');

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
  selections.push(...Quarters.fields());

  clauses.push(selections.join(', '));
  clauses.push(`FROM ${Quarters.tableName()}`);

  if (hasQuarter || hasYear) {
    clauses.push('WHERE');
  }

  if (hasQuarter) {
    clauses.push(`${Quarters.field('quarter')} = ?`);
    params.push(quarter);
  }

  if (hasQuarter && hasYear) {
    clauses.push('AND');
  }

  if (hasYear) {
    clauses.push(`${Quarters.field('year')} = ?`);
    params.push(year);
  }

  clauses.push(`ORDER BY ${Quarters.tableName()}.year ASC, ${Quarters.tableName()}.quarter ASC`);


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
