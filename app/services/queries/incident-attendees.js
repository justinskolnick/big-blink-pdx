const queryHelper = require('../../helpers/query');

const Entity = require('../../models/entity');
const Incident = require('../../models/incident');
const IncidentAttendee = require('../../models/incident-attendee');
const Person = require('../../models/person');
const Source = require('../../models/source');

const getAllQuery = (options = {}) => {
  const {
    page,
    perPage,
    incidentId,
  } = options;

  const hasIncidentId = Boolean(incidentId);
  const hasPage = Boolean(page);
  const hasPerPage = Boolean(perPage);

  const clauses = [];
  const conditions = [];
  const selections = [];
  const params = [];

  clauses.push('SELECT');

  selections.push(...IncidentAttendee.fields());
  selections.push(`${Person.field('id')} AS ${Person.foreignKey()}`);
  selections.push(...IncidentAttendee.personFields(['id']));

  clauses.push(selections.join(', '));

  clauses.push(`FROM ${IncidentAttendee.tableName}`);
  clauses.push(queryHelper.leftJoin(IncidentAttendee, Person, true));

  if (hasIncidentId) {
    clauses.push('WHERE');

    conditions.push(`${IncidentAttendee.field(Incident.foreignKey())} = ?`);
    params.push(incidentId);

    clauses.push(...queryHelper.joinConditions(conditions));
  }

  clauses.push('ORDER BY');
  clauses.push(`${IncidentAttendee.field('role')} ASC, ${Person.field('family')} ASC`);

  if (hasPage && hasPerPage) {
    const offset = queryHelper.getOffset(page, perPage);

    clauses.push('LIMIT ?,?');
    params.push(offset, perPage);
  }

  return { clauses, params };
};

const buildEntitiesQuery = (options = {}) => {
  const {
    personId,
    personRole,
    totalOnly = false,
  } = options;

  const hasPersonId = Boolean(personId);
  const hasPersonRole = Boolean(personRole);

  const clauses = [];
  const selections = [];
  const params = [];

  clauses.push('SELECT');

  if (totalOnly) {
    clauses.push(`COUNT(DISTINCT ${Entity.primaryKey()}) AS total`);
  } else {
    selections.push(Entity.field('id'));
    selections.push(Entity.field('name'));

    clauses.push(selections.join(', '));
  }

  clauses.push(`FROM ${Incident.tableName}`);
  clauses.push(queryHelper.leftJoin(Incident, Entity, true));

  if (hasPersonId) {
    const subqueryClauses = [];

    subqueryClauses.push('SELECT');
    subqueryClauses.push(`${IncidentAttendee.field(Incident.foreignKey())} AS id`);
    subqueryClauses.push(`FROM ${IncidentAttendee.tableName}`);
    subqueryClauses.push('WHERE');
    subqueryClauses.push(`${IncidentAttendee.field(Person.foreignKey())} = ?`);
    params.push(personId);

    if (hasPersonRole) {
      subqueryClauses.push('AND');
      subqueryClauses.push(`${IncidentAttendee.field('role')} = ?`);
      params.push(personRole);
    }

    clauses.push('WHERE');
    clauses.push(`${Incident.primaryKey()} IN (${subqueryClauses.join(' ')})`);
  }

  if (!totalOnly) {
    clauses.push('ORDER BY');
    clauses.push(`${Entity.field('name')} ASC`);
  }

  return { clauses, params };
};

const getEntitiesQuery = (options = {}) => buildEntitiesQuery(options);

const getEntitiesTotalQuery = (options = {}) => buildEntitiesQuery({
  ...options,
  totalOnly: true,
});

const getHasLobbiedOrBeenLobbiedQuery = (options = {}) => {
  const {
    personId,
    role,
  } = options;

  const hasPersonId = Boolean(personId);
  const hasRole = Boolean(role);

  const clauses = [];
  const conditions = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(`IF(COUNT(${IncidentAttendee.primaryKey()}) > 0, 'true', 'false') AS hasLobbiedOrBeenLobbied`);

  clauses.push(`FROM ${IncidentAttendee.tableName}`);

  if (hasPersonId && hasRole) {
    clauses.push('WHERE');
    conditions.push(`${IncidentAttendee.field('role')} = ?`);
    params.push(role);

    conditions.push(`${IncidentAttendee.field(Person.foreignKey())} = ?`);
    params.push(personId);
  }

  if (conditions.length) {
    clauses.push(conditions.join(' AND '));
  }

  return { clauses, params };
};

const buildPeopleQuery = (options = {}) => {
  const {
    entityId,
    personId,
    personRole,
    role,
    sourceId,
    totalOnly = false,
  } = options;

  const hasEntityId = Boolean(entityId);
  const hasPersonId = Boolean(personId);
  const hasRole = Boolean(role);
  const hasSourceId = Boolean(sourceId);

  const clauses = [];
  const selections = [];
  const conditions = [];
  const params = [];

  clauses.push('SELECT');

  if (totalOnly) {
    clauses.push(`COUNT(DISTINCT ${IncidentAttendee.field(Person.foreignKey())}) AS total`);
  } else {
    selections.push(`${IncidentAttendee.field(Person.foreignKey())} AS id`);
    selections.push(Person.field('name'));
    selections.push(Person.field('type'));

    clauses.push(selections.join(', '));
  }

  clauses.push(`FROM ${IncidentAttendee.tableName}`);
  clauses.push(queryHelper.leftJoin(IncidentAttendee, Person, true));

  if (hasEntityId || hasPersonId || hasRole || hasSourceId) {
    const subqueryClauses = [];

    clauses.push('WHERE');

    if (hasEntityId || hasSourceId) {
      subqueryClauses.push('SELECT');
      subqueryClauses.push(Incident.field('id'));
      subqueryClauses.push(`FROM ${Incident.tableName}`);
      subqueryClauses.push('WHERE');

      if (hasEntityId) {
        subqueryClauses.push(`${Incident.field(Entity.foreignKey())} = ?`);
        params.push(entityId);
      }

      if (hasSourceId) {
        subqueryClauses.push(`${Incident.field(Source.foreignKey())} = ?`);
        params.push(sourceId);
      }
    }

    if (hasPersonId) {
      subqueryClauses.push('SELECT');
      subqueryClauses.push(`${IncidentAttendee.field(Incident.foreignKey())} AS id`);
      subqueryClauses.push(`FROM ${IncidentAttendee.tableName}`);
      subqueryClauses.push('WHERE');
      subqueryClauses.push(`${IncidentAttendee.field(Person.foreignKey())} = ?`);
      params.push(personId);

      if (personRole) {
        subqueryClauses.push('AND');
        subqueryClauses.push(`${IncidentAttendee.field('role')} = ?`);
        params.push(personRole);
      }
    }

    if (subqueryClauses.length) {
      conditions.push(`${IncidentAttendee.field(Incident.foreignKey())} IN (${subqueryClauses.join(' ')})`);
    }

    if (hasPersonId) {
      conditions.push(`${IncidentAttendee.field(Person.foreignKey())} != ?`);
      params.push(personId);
    }

    if (hasRole) {
      conditions.push(`${IncidentAttendee.field('role')} = ?`);
      params.push(role);
    }
  }

  clauses.push(...queryHelper.joinConditions(conditions));

  if (!totalOnly) {
    clauses.push('ORDER BY');
    clauses.push(`${IncidentAttendee.field(Person.foreignKey())} ASC`);
  }

  return { clauses, params };
};

const getPeopleQuery = (options = {}) => buildPeopleQuery(options);

const getPeopleTotalQuery = (options = {}) => buildPeopleQuery({
  ...options,
  totalOnly: true,
});

module.exports = {
  getAllQuery,
  getEntitiesQuery,
  getEntitiesTotalQuery,
  getHasLobbiedOrBeenLobbiedQuery,
  getPeopleQuery,
  getPeopleTotalQuery,
};
