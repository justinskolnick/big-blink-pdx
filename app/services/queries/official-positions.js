const queryHelper = require('../../helpers/query');

const OfficialPositions = require('../tables/official-positions');
const People = require('../tables/people');

const getAtPernrQuery = (pernr, options = {}) => {
  const {
    dateOn,
  } = options;
  const hasDateOn = Boolean(dateOn);

  const clauses = [];
  const selections = [];
  const conditions = [];
  const sortColumns = [];
  const params = [];

  clauses.push('SELECT');

  selections.push(...OfficialPositions.fields());
  selections.push(`${People.field('name')} as personal_name`);

  clauses.push(selections.join(', '));

  clauses.push(`FROM ${OfficialPositions.tableName()}`);
  clauses.push(`LEFT JOIN ${People.tableName()} ON ${People.field('pernr')} = ${OfficialPositions.field('pernr')}`);

  clauses.push('WHERE');

  conditions.push(`${OfficialPositions.field('pernr')} = ?`);
  params.push(pernr);

  if (hasDateOn) {
    conditions.push('date_start <= ? and (date_end is null OR date_end >= ?)');
    params.push(dateOn, dateOn);
  }

  clauses.push(...queryHelper.joinConditions(conditions));

  // group by all fields to address duplicate rows
  clauses.push('GROUP BY');
  clauses.push([...OfficialPositions.fields()].join(', '));

  clauses.push('ORDER BY');

  sortColumns.push(`${OfficialPositions.field('date_start')} ASC`);
  sortColumns.push(`${OfficialPositions.field('date_end')} ASC`);

  clauses.push(sortColumns.join(', '));

  return { clauses, params };
};

module.exports = {
  getAtPernrQuery,
};
