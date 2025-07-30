const queryHelper = require('../../helpers/query');

const OfficialPosition = require('../../models/official-position');

const getAtPernrQuery = (pernr) => {
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

  clauses.push(...queryHelper.joinConditions(conditions));

  return { clauses, params };
};

module.exports = {
  getAtPernrQuery,
};
