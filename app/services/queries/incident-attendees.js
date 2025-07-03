const queryHelper = require('../../helpers/query');

const Entity = require('../../models/entity');
const Incident = require('../../models/incident');
const IncidentAttendee = require('../../models/incident-attendee');
const Person = require('../../models/person');

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

    conditions.push(`${IncidentAttendee.field('person_id')} = ?`);
    params.push(personId);
  }

  if (conditions.length) {
    clauses.push(conditions.join(' AND '));
  }

  return { clauses, params };
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

module.exports = {
  getAllQuery,
  getEntitiesQuery,
  getHasLobbiedOrBeenLobbiedQuery,
  getPeopleQuery,
};
