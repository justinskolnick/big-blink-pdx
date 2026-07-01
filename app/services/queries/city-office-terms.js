const { SORT_ASC } = require('../../config/constants');

const queryHelper = require('../../helpers/query');

const CityOffices = require('../tables/city-offices');
const CityOfficeTerms = require('../tables/city-office-terms');
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

    selections.push(...CityOfficeTerms.fields());
    selections.push(...CityOffices.fields());

    clauses.push(selections.join(', '));

    clauses.push(`FROM ${CityOfficeTerms.tableName()}`);
    clauses.push(queryHelper.leftJoin(CityOfficeTerms, CityOffices, true));

    clauses.push('WHERE');
    clauses.push(`${CityOfficeTerms.field(People.foreignKey())} = ?`);

    params.push(personId);

    clauses.push('ORDER BY');
    clauses.push(`${CityOfficeTerms.field('date_start')} ${SORT_ASC}`);
  }

  return { clauses, params };
};

module.exports = {
  getAllQuery,
};
