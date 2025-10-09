const pluralize = require('pluralize');

const {
  getRangesByYearSet,
  getRangeStatement,
} = require('../helpers/quarters');

const IncidentAttendee = require('../models/incident-attendee');

const db = require('./db');
const entityLobbyistRegistrations = require('./entity-lobbyist-registrations');
const {
  getAllQuery,
  getEntitiesQuery,
  getEntitiesTotalQuery,
  getHasLobbiedOrBeenLobbiedQuery,
  getPeopleQuery,
  getPeopleTotalQuery,
} = require('./queries/incident-attendees');

const getAttendee = (result) => {
  const attendee = new IncidentAttendee(result);

  attendee.setPersonObject();

  return attendee;
};

const getAll = async (options = {}) => {
  const { clauses, params } = getAllQuery(options);

  const results = await db.getAll(clauses, params);
  const groupedResults = results
    .map(result => result.role)
    .reduce((all, role) => {
      const key = pluralize(role);
      const byRole = results.filter(result => result.role === role);

      all[key] = byRole.map(getAttendee);

      return all;
    }, {});

  return groupedResults;
};

const getAllForIncident = async (incident) => {
  const result = await getAll({ incidentId: incident.id });

  incident.attendees = Object.entries(result).reduce((attendees, [key, values]) => {
    attendees[key] = {
      records: values.map(value => value.adapted),
    };

    return attendees;
  }, {});

  return incident;
};

const getAllForIncidents = async (incidents) => {
  const amended = await Promise.all(incidents.map(getAllForIncident));

  return amended;
};

const getEntitiesRecords = async (options = {}, limit = null) => {
  const { clauses, params } = getEntitiesQuery(options, limit);
  const results = await db.getAll(clauses, params);

  return results;
};

const getEntitiesTotal = async (options = {}) => {
  const { clauses, params } = getEntitiesTotalQuery(options);
  const result = await db.get(clauses, params);

  return result.total;
};

const getEntities = async (options = {}, limit = null) => {
  const { personId, personRole } = options;
  const hasPersonId = Boolean(personId);

  const results = await Promise.all([
    getEntitiesTotal(options),
    getEntitiesRecords(options, limit),
  ]);
  const [total, records] = results;

  let collectedRecords = records.map(entity => ({
    entity,
    total: entity.total,
  }));

  if (hasPersonId && personRole === IncidentAttendee.roles.lobbyist) {
    collectedRecords = await Promise.all(collectedRecords.map(async (result) => {
      const entityRegistrationResults = await entityLobbyistRegistrations.getTotal({
        entityId: result.entity.id,
      });

      result.entity.isRegistered = entityRegistrationResults > 0;

      const personRegistrationResults = await entityLobbyistRegistrations.getQuarters({
        entityId: result.entity.id,
        personId,
      });

      result.isRegistered = personRegistrationResults.length > 0;

      if (result.isRegistered) {
        result.registrations = `Registered to lobby on behalf of ${result.entity.name} for ${getRangeStatement(getRangesByYearSet(personRegistrationResults))}`;
      } else {
        result.registrations = 'No record of registration was found';
      }

      return result;
    }));
  }

  return {
    records: collectedRecords,
    total,
  };
};

const getHasLobbiedOrBeenLobbied = async (options = {}) => {
  const { clauses, params } = getHasLobbiedOrBeenLobbiedQuery(options);
  const result = await db.get(clauses, params);

  return result.hasLobbiedOrBeenLobbied === 'true';
};

const getPeopleRecords = async (options = {}, limit = null) => {
  const { clauses, params } = getPeopleQuery(options, limit);
  const results = await db.getAll(clauses, params);

  return results;
};

const getPeopleTotal = async (options = {}) => {
  const { clauses, params } = getPeopleTotalQuery(options);
  const result = await db.get(clauses, params);

  return result.total;
};

const getAttendeesByRole = async (role, options = {}, limit = null) => {
  const roleOptions = {
    ...options,
    role,
  };

  const results = await Promise.all([
    getPeopleTotal(roleOptions),
    getPeopleRecords(roleOptions, limit),
  ]);
  const [total, people] = results;
  const records = people.map(person => ({
    person,
    total: person.total,
  }));

  return {
    records,
    role,
    total,
  };
};

const getAttendees = async (options = {}, limit = null) => {
  const lobbyists = await getAttendeesByRole(IncidentAttendee.roles.lobbyist, options, limit);
  const officials = await getAttendeesByRole(IncidentAttendee.roles.official, options, limit);

  return {
    lobbyists,
    officials,
  };
};

module.exports = {
  getAll,
  getAllForIncidents,
  getAttendees,
  getHasLobbiedOrBeenLobbied,
  getEntities,
};
