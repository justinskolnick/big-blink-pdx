const pluralize = require('pluralize');

const {
  getRangesByYearSet,
  getRangeStatement,
} = require('../helpers/quarters');
const queryHelper = require('../helpers/query');
const { sortTotalDescending } = require('../lib/sorting');
const Entity = require('../models/entity');
const Incident = require('../models/incident');
const IncidentAttendee = require('../models/incident-attendee');
const Person = require('../models/person');
const db = require('./db');
const entityLobbyistRegistrations = require('./entity-lobbyist-registrations');

const getAllQuery = (options = {}) => {
  const { page, perPage, incidentId } = options;

  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(
    [
      ...IncidentAttendee.fields(),
      `${Person.field('id')} AS person_id`,
      Person.field('name'),
      Person.field('type'),
    ].join(', ')
  );
  clauses.push(`FROM ${IncidentAttendee.tableName}`);
  clauses.push(`LEFT JOIN ${Person.tableName} ON ${Person.primaryKey()} = ${IncidentAttendee.field('person_id')}`);

  if (incidentId) {
    clauses.push('WHERE incident_id = ?');
    params.push(incidentId);
  }

  clauses.push(`ORDER BY ${IncidentAttendee.field('role')} ASC, ${Person.field('family')} ASC`);

  if (page && perPage) {
    const offset = queryHelper.getOffset(page, perPage);

    clauses.push('LIMIT ?,?');
    params.push(offset, perPage);
  }

  return { clauses, params };
};

const getAll = async (options = {}) => {
  const { clauses, params } = getAllQuery(options);

  const results = await db.getAll(clauses, params);
  const groupedResults = results
    .map(result => result.role)
    .reduce((all, role) => {
      const key = pluralize(role);

      all[key] = results
        .filter(result => result.role === role)
        .map(result => IncidentAttendee.adapt(result));

      return all;
    }, {});

  return groupedResults;
};

const getAllForIncidents = async (incidents) => {
  const amended = await Promise.all(incidents.map(async (incident) => {
    const result = await getAll({ incidentId: incident.id });

    incident.attendees = Object.entries(result).reduce((attendees, [key, value]) => {
      attendees[key] = {
        records: value,
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

const getEntitiesQuery = (options = {}) => {
  const { personId, personRole } = options;

  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(`${Entity.field('id')}, ${Entity.field('name')}`);
  clauses.push(`FROM ${Incident.tableName}`);
  clauses.push(`LEFT JOIN ${Entity.tableName}`);
  clauses.push(`ON ${Entity.primaryKey()} = ${Incident.field('entity_id')}`);

  if (personId) {
    const segments = [];
    segments.push('SELECT');
    segments.push(`incident_id AS id FROM ${IncidentAttendee.tableName}`);
    segments.push('WHERE person_id = ?');
    params.push(personId);

    if (personRole) {
      segments.push('AND role = ?');
      params.push(personRole);
    }

    clauses.push(`WHERE ${Incident.primaryKey()} IN`);
    clauses.push('(' + segments.join(' ') + ')');
  }

  clauses.push(`ORDER BY ${Entity.field('name')} ASC`);

  return { clauses, params };
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

const getPeopleQuery = (options = {}) => {
  const { entityId, personId, personRole, role, sourceId } = options;

  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(`${Person.field('name')}, ${IncidentAttendee.field('person_id')} AS id, ${Person.field('type')}`);
  clauses.push(`FROM ${IncidentAttendee.tableName}`);
  clauses.push(`LEFT JOIN ${Person.tableName} ON ${Person.primaryKey()} = ${IncidentAttendee.field('person_id')}`);

  if (entityId || personId || sourceId) {
    clauses.push(`WHERE ${IncidentAttendee.field('incident_id')} IN`);
  }

  if (entityId) {
    clauses.push(`(SELECT id FROM ${Incident.tableName} WHERE entity_id = ?)`);
    params.push(entityId);
  }

  if (personId) {
    const segments = [];
    segments.push('SELECT');
    segments.push(`incident_id AS id FROM ${IncidentAttendee.tableName}`);
    segments.push('WHERE person_id = ?');
    params.push(personId);

    if (personRole) {
      segments.push('AND role = ?');
      params.push(personRole);
    }

    clauses.push('(' + segments.join(' ') + ')');
  }

  if (personId) {
    clauses.push(`AND ${IncidentAttendee.field('person_id')} != ?`);
    params.push(personId);
  }

  if (sourceId) {
    clauses.push(`(SELECT id FROM ${Incident.tableName} WHERE data_source_id = ?)`);
    params.push(sourceId);
  }

  if (role) {
    clauses.push(`AND ${IncidentAttendee.field('role')} = ?`);
    params.push(role);
  }

  clauses.push(`ORDER BY ${IncidentAttendee.field('person_id')} ASC`);

  return { clauses, params };
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
  getAllQuery,
  getAllForIncidents,
  getAttendees,
  getEntities,
  getEntitiesQuery,
  getPeopleQuery,
};
