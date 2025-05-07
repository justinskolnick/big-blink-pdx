const pluralize = require('pluralize');

const {
  getRangesByYearSet,
  getRangeStatement,
} = require('../helpers/quarters');

const { sortTotalDescending } = require('../lib/sorting');

const IncidentAttendee = require('../models/incident-attendee');

const db = require('./db');
const entityLobbyistRegistrations = require('./entity-lobbyist-registrations');
const {
  getAllQuery,
  getEntitiesQuery,
  getPeopleQuery,
} = require('./queries/incident-attendees');

const getAll = async (options = {}) => {
  const { clauses, params } = getAllQuery(options);

  const results = await db.getAll(clauses, params);
  const groupedResults = results
    .map(result => result.role)
    .reduce((all, role) => {
      const key = pluralize(role);

      all[key] = results
        .filter(result => result.role === role)
        .map(result => {
          const attendee = new IncidentAttendee(result);

          return attendee.adapted;
        });

      return all;
    }, {});

  return groupedResults;
};

const getAllForIncidents = async (incidents) => {
  const amended = await Promise.all(incidents.map(async (incident) => {
    const result = await getAll({ incidentId: incident.id });

    incident.attendees = Object.entries(result).reduce((attendees, [key, values]) => {
      attendees[key] = {
        records: values,
      };

      return attendees;
    }, {});

    return incident;
  }));

  return amended;
};

// todo: add count to query
const collectEntities = entities => {
  const unsorted = entities
    .reduce((byKey, values) => {
      const key = values.id;

      if (key in byKey) {
        byKey[key].total = byKey[key].total + 1;
      } else {
        byKey[key] = {
          entity: values,
          total: 1,
        };
      }
      return byKey;
    }, {});

  return Object.values(unsorted).sort(sortTotalDescending);
};

const getEntities = async (options = {}) => {
  const { personId, personRole } = options;
  const { clauses, params } = getEntitiesQuery(options);
  const hasPersonId = Boolean(personId);

  const results = await db.getAll(clauses, params);

  let collectedResults = collectEntities(results);

  if (hasPersonId && personRole === IncidentAttendee.roles.lobbyist) {
    collectedResults = await Promise.all(collectedResults.map(async (result) => {
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
        result.registrations = `Registered to lobby on behalf of this entity for ${getRangeStatement(getRangesByYearSet(personRegistrationResults))}`;
      } else {
        result.registrations = 'No record of registration was found';
      }

      return result;
    }));
  }

  return collectedResults;
};

// todo: add count to query
const collectPeople = people => {
  const unsorted = people
    .reduce((byKey, values) => {
      const key = values.id;

      if (key in byKey) {
        byKey[key].total = byKey[key].total + 1;
      } else {
        byKey[key] = {
          person: values,
          total: 1,
        };
      }
      return byKey;
    }, {});

  return {
    records: Object.values(unsorted).sort(sortTotalDescending),
  };
};

const getPeople = async (options = {}) => {
  const { clauses, params } = getPeopleQuery(options);
  const results = await db.getAll(clauses, params);

  return results;
};

const getLobbyists = async (options = {}) => {
  options.role = IncidentAttendee.roles.lobbyist;

  const people = await getPeople(options);

  return collectPeople(people);
};

const getOfficials = async (options = {}) => {
  options.role = IncidentAttendee.roles.official;

  const people = await getPeople(options);

  return collectPeople(people);
};

const getAttendees = async (options = {}) => {
  const lobbyists = await getLobbyists(options);
  const officials = await getOfficials(options);

  return {
    lobbyists,
    officials,
  };
};

module.exports = {
  getAll,
  getAllForIncidents,
  getAttendees,
  getEntities,
};
