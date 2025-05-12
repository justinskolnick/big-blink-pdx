const {
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../config/constants');

const Person = require('../models/person');
const db = require('./db');
const {
  getAllQuery,
  getAtIdQuery,
  getTotalQuery,
} = require('./queries/people');
const entityLobbyistRegistrations = require('./entity-lobbyist-registrations');
const incidentAttendees = require('./incident-attendees');

const getAll = async (options = {}) => {
  const { clauses, params } = getAllQuery(options);
  const results = await db.getAll(clauses, params);

  return results.map(result => new Person(result));
};

const getAtId = async (id) => {
  const { clauses, params } = getAtIdQuery(id);
  const result = await db.get(clauses, params);

  return new Person(result);
};

const getHasLobbiedOrBeenLobbied = async (id) => {
  const results = await Promise.all([
    entityLobbyistRegistrations.getHasBeenCityEmployee({
      personId: id,
    }),
    incidentAttendees.getHasLobbiedOrBeenLobbied({
      personId: id,
      role: ROLE_OFFICIAL,
    }),
    incidentAttendees.getHasLobbiedOrBeenLobbied({
      personId: id,
      role: ROLE_LOBBYIST,
    }),
  ]);

  const [
    hasBeenEmployee,
    hasBeenLobbied,
    hasLobbied,
  ] = results;

  return {
    hasBeenEmployee,
    hasBeenLobbied,
    hasLobbied,
  };
};

const getTotal = async () => {
  const sql = getTotalQuery();
  const result = await db.get(sql);

  return result.total;
};

module.exports = {
  getAll,
  getAtId,
  getHasLobbiedOrBeenLobbied,
  getTotal,
};
