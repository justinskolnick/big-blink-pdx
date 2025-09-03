const queryHelper = require('../../helpers/query');

const OfficialPosition = require('../../models/official-position');
const Person = require('../../models/person');

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

  selections.push(...OfficialPosition.fields());
  selections.push(`${Person.field('name')} as personal_name`);

  clauses.push(selections.join(', '));

  clauses.push(`FROM ${OfficialPosition.tableName}`);
  clauses.push(`LEFT JOIN ${Person.tableName} ON ${Person.field('pernr')} = ${OfficialPosition.field('pernr')}`);

  clauses.push('WHERE');

  conditions.push(`${OfficialPosition.field('pernr')} = ?`);
  params.push(pernr);

  if (hasDateOn) {
    conditions.push('date_start <= ? and (date_end is null OR date_end >= ?)');
    params.push(dateOn, dateOn);
  }

  clauses.push(...queryHelper.joinConditions(conditions));

  // group by all fields to address duplicate rows
  clauses.push('GROUP BY');
  clauses.push([...OfficialPosition.fields()].join(', '));

  clauses.push('ORDER BY');

  sortColumns.push(`${OfficialPosition.field('date_start')} ASC`);
  sortColumns.push(`${OfficialPosition.field('date_end')} ASC`);

  clauses.push(sortColumns.join(', '));

  return { clauses, params };
};

module.exports = {
  getAtPernrQuery,
};
