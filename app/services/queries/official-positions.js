const queryHelper = require('../../helpers/query');

const OfficialPosition = require('../../models/official-position');

const getAtPernrQuery = (pernr, dateOn = null) => {
  const hasDateOn = Boolean(dateOn);

  const clauses = [];
  const selections = [];
  const conditions = [];
  const params = [];

  clauses.push('SELECT');

  selections.push(...OfficialPosition.fields());
  clauses.push(selections.join(', '));

  clauses.push(`FROM ${OfficialPosition.tableName}`);
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
  clauses.push(selections.join(', '));

  clauses.push('ORDER BY');
  clauses.push(`${OfficialPosition.field('date_start')} ASC`);

  return { clauses, params };
};

module.exports = {
  getAtPernrQuery,
};
