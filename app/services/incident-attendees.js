const pluralize = require('pluralize');

const {
  ASSOCIATION_LOBBYISTS,
  ASSOCIATION_OFFICIALS,
} = require('../config/constants');

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
  const {
    personId,
    personRole,
  } = options;

  const hasPersonId = Boolean(personId);
  const hasPersonRole = Boolean(personRole);

  const results = await Promise.all([
    getEntitiesTotal(options),
    getEntitiesRecords(options, limit),
  ]);
  const [totalRecords, records] = results;

  let collectedRecords = records.map(entity => {
    const { total, ...rest } = entity;

    return {
      entity: rest,
      total,
    };
  });

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

      result.lobbyist = {
        id: personId,
        isRegistered: personRegistrationResults.length > 0,
        range: getRangeStatement(getRangesByYearSet(personRegistrationResults)),
      };

      return result;
    }));
  }

  const result = {
    records: collectedRecords,
    total: totalRecords,
  };

  if (hasPersonRole) {
    result.role = personRole;
  }

  return result;
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
  const totalOptions = {
    ...options,
    role,
  };
  const recordsOptions = {
    ...options,
    includeTotal: true,
    role,
  };

  const results = await Promise.all([
    getPeopleTotal(totalOptions),
    getPeopleRecords(recordsOptions, limit),
  ]);
  const [totalRecords, people] = results;

  const records = people.map(person => {
    const { total, ...rest } = person;

    return {
      person: rest,
      total,
    };
  });

  return {
    records,
    role,
    total: totalRecords,
  };
};

const getAttendees = async (options = {}, limit = null) => {
  const { association } = options;

  let lobbyists;
  let officials;

  if (association === ASSOCIATION_LOBBYISTS) {
    lobbyists = await getAttendeesByRole(IncidentAttendee.roles.lobbyist, options, limit);
  } else if (association === ASSOCIATION_OFFICIALS) {
    officials = await getAttendeesByRole(IncidentAttendee.roles.official, options, limit);
  } else {
    const results = await Promise.all([
      getAttendeesByRole(IncidentAttendee.roles.lobbyist, options, limit),
      getAttendeesByRole(IncidentAttendee.roles.official, options, limit),
    ]);
    [ lobbyists, officials ] = results;
  }

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
