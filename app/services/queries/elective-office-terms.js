const { SORT_ASC } = require('../../config/constants');

const queryHelper = require('../../helpers/query');

const ElectiveOffices = require('../tables/elective-offices');
const ElectiveOfficeTerms = require('../tables/elective-office-terms');
const People = require('../tables/people');

const getAllQuery = (options = {}) => {
  const {
    personId,
  } = options;

  const hasPersonId = Boolean(personId);

  const clauses = [];
  const selections = [];
  const params = [];

  if (hasPersonId) {
    clauses.push('SELECT');

    selections.push(...ElectiveOfficeTerms.fields());
    selections.push(...ElectiveOffices.fields());

    clauses.push(selections.join(', '));

    clauses.push(`FROM ${ElectiveOfficeTerms.tableName()}`);
    clauses.push(queryHelper.leftJoin(ElectiveOfficeTerms, ElectiveOffices, true));

    clauses.push('WHERE');
    clauses.push(`${ElectiveOfficeTerms.field(People.foreignKey())} = ?`);

    params.push(personId);

    clauses.push('ORDER BY');
    clauses.push(`${ElectiveOfficeTerms.field('date_start')} ${SORT_ASC}`);
  }

  return { clauses, params };
};

module.exports = {
  getAllQuery,
};
