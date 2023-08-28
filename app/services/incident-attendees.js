const pluralize = require('pluralize');

const queryHelper = require('../helpers/query');
const { sortTotalDescending } = require('../lib/sorting');
const { TABLE: ENTITIES_TABLE } = require('../models/entities');
const { TABLE } = require('../models/incident-attendees');
const { TABLE: INCIDENTS_TABLE } = require('../models/incidents');
const { TABLE: PEOPLE_TABLE } = require('../models/people');
const db = require('../services/db');

const adaptJoined = data => ({
  id: data.id,
  as: data.appears_as,
  person: {
    id: data.person_id,
    name: data.name,
    type: data.type,
  },
});

const getAllQuery = (options = {}) => {
  const { page, perPage, incidentId } = options;

  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(
    `${TABLE}.id,`,
    `${TABLE}.appears_as,`,
    `${TABLE}.role,`,
    `${PEOPLE_TABLE}.id AS person_id,`,
    `${PEOPLE_TABLE}.name,`,
    `${PEOPLE_TABLE}.type`
  );
  clauses.push(`FROM ${TABLE}`);
  clauses.push(`LEFT JOIN ${PEOPLE_TABLE} ON ${PEOPLE_TABLE}.id = ${TABLE}.person_id`);

  if (incidentId) {
    clauses.push('WHERE incident_id = ?');
    params.push(incidentId);
  }

  clauses.push(`ORDER BY ${TABLE}.role ASC, ${PEOPLE_TABLE}.family ASC`);

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
        .map(adaptJoined);

      return all;
    }, {});

  return groupedResults;
};

const getAllForIncidents = async (incidents) => {
  const amended = await Promise.all(incidents.map(async (incident) => {
    const attendeesResult = await getAll({ incidentId: incident.id });
    incident.attendees = attendeesResult;

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
  clauses.push(`${ENTITIES_TABLE}.id, ${ENTITIES_TABLE}.name`);
  clauses.push(`FROM ${INCIDENTS_TABLE}`);
  clauses.push(`LEFT JOIN ${ENTITIES_TABLE}`);
  clauses.push(`ON ${ENTITIES_TABLE}.id = ${INCIDENTS_TABLE}.entity_id`);

  if (personId) {
    const segments = [];
    segments.push('SELECT');
    segments.push(`incident_id AS id FROM ${TABLE}`);
    segments.push('WHERE person_id = ?');
    params.push(personId);

    if (personRole) {
      segments.push('AND role = ?');
      params.push(personRole);
    }

    clauses.push(`WHERE ${INCIDENTS_TABLE}.id IN`);
    clauses.push('(' + segments.join(' ') + ')');
  }

  clauses.push(`ORDER BY ${ENTITIES_TABLE}.name ASC`);

  return { clauses, params };
};

const getEntities = async (options = {}) => {
  const { clauses, params } = getEntitiesQuery(options);

  const results = await db.getAll(clauses, params);

  return collectEntities(results);
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

  return Object.values(unsorted).sort(sortTotalDescending);
};

const getPeopleQuery = (options = {}) => {
  const { entityId, personId, personRole, role, sourceId } = options;

  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(`${PEOPLE_TABLE}.name, ${TABLE}.person_id AS id, ${PEOPLE_TABLE}.type`);
  clauses.push(`FROM ${TABLE}`);
  clauses.push(`LEFT JOIN ${PEOPLE_TABLE} ON ${PEOPLE_TABLE}.id = ${TABLE}.person_id`);

  if (entityId || personId || sourceId) {
    clauses.push(`WHERE ${TABLE}.incident_id IN`);
  }

  if (entityId) {
    clauses.push(`(SELECT id FROM ${INCIDENTS_TABLE} WHERE entity_id = ?)`);
    params.push(entityId);
  }

  if (personId) {
    const segments = [];
    segments.push('SELECT');
    segments.push(`incident_id AS id FROM ${TABLE}`);
    segments.push('WHERE person_id = ?');
    params.push(personId);

    if (personRole) {
      segments.push('AND role = ?');
      params.push(personRole);
    }

    clauses.push('(' + segments.join(' ') + ')');
  }

  if (personId) {
    clauses.push(`AND ${TABLE}.person_id != ?`);
    params.push(personId);
  }

  if (sourceId) {
    clauses.push(`(SELECT id FROM ${INCIDENTS_TABLE} WHERE data_source_id = ?)`);
    params.push(sourceId);
  }

  if (role) {
    clauses.push(`AND ${TABLE}.role = ?`);
    params.push(role);
  }

  clauses.push(`ORDER BY ${TABLE}.person_id ASC`);

  return { clauses, params };
};

const getPeople = async (options = {}) => {
  const { clauses, params } = getPeopleQuery(options);
  const results = await db.getAll(clauses, params);

  return results;
};

const getLobbyists = async (options = {}) => {
  options.role = 'lobbyist';

  const people = await getPeople(options);

  return collectPeople(people);
};

const getOfficials = async (options = {}) => {
  options.role = 'official';

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
