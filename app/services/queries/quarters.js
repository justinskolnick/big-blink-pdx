const Quarter = require('../../models/quarter');

const getQuarterQuery = (options = {}) => {
  const {
    quarter,
    year,
  } = options;
  const hasQuarter = Boolean(quarter);
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
  clauses.push('LIMIT 1');

  return { clauses, params };
};

module.exports = {
  getQuarterQuery,
};
