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
  clauses.push(`LEFT JOIN ${Person.tableName} ON ${Person.primaryKey()} = ${IncidentAttendee.field(Person.foreignKey())}`);

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

const getEntitiesQuery = (options = {}) => {
  const {
    personId,
    personRole,
  } = options;

  const hasPersonId = Boolean(personId);
  const hasPersonRole = Boolean(personRole);

  const clauses = [];
  const selections = [];
  const params = [];

  clauses.push('SELECT');

  selections.push(Entity.field('id'));
  selections.push(Entity.field('name'));

  clauses.push(selections.join(', '));

  clauses.push(`FROM ${Incident.tableName}`);
  clauses.push(`LEFT JOIN ${Entity.tableName}`);
  clauses.push(`ON ${Entity.primaryKey()} = ${Incident.field(Entity.foreignKey())}`);

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

  clauses.push('ORDER BY');
  clauses.push(`${Entity.field('name')} ASC`);

  return { clauses, params };
};

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

const getPeopleQuery = (options = {}) => {
  const {
    entityId,
    personId,
    personRole,
    role,
    sourceId,
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

  selections.push(`${IncidentAttendee.field(Person.foreignKey())} AS id`);
  selections.push(Person.field('name'));
  selections.push(Person.field('type'));

  clauses.push(selections.join(', '));

  clauses.push(`FROM ${IncidentAttendee.tableName}`);
  clauses.push(`LEFT JOIN ${Person.tableName} ON ${Person.primaryKey()} = ${IncidentAttendee.field(Person.foreignKey())}`);

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

  clauses.push('ORDER BY');
  clauses.push(`${IncidentAttendee.field(Person.foreignKey())} ASC`);

  return { clauses, params };
};

module.exports = {
  getAllQuery,
  getEntitiesQuery,
  getHasLobbiedOrBeenLobbiedQuery,
  getPeopleQuery,
};
