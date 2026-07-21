const CityOffice = require('../models/city-office');
const CityOfficeTerms = require('../models/city-office-term');
const Election = require('../models/election');

const db = require('./db');
const { getAllQuery } = require('./queries/city-office-terms');

const getAll = async (options = {}) => {
  const { person } = options;
  const { clauses, params } = getAllQuery({
    personId: person.id,
  });
  const results = await db.getAll(clauses, params);

  return results.map(result => {
    const cityOfficeTerm = new CityOfficeTerms(result);
    const cityOffice = new CityOffice({
      id:         result.city_office_id,
      office:     result.office,
      district:   result.district,
      position:   result.position,
      is_elected: result.is_elected, // eslint-disable-line camelcase
    });
    const election = new Election({
      id:           result.election_id,
      year:         result.year,
      election_day: result.election_day,
      type:         result.type,
    });

    cityOfficeTerm.setCityOffice(cityOffice);
    cityOfficeTerm.setElection(election);

    return cityOfficeTerm;
  });
};

module.exports = {
  getAll,
};
