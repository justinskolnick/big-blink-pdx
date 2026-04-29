const Entities = require('../tables/entities');
const Incidents = require('../tables/incidents');
const IncidentAttendees = require('../tables/incident-attendees');
const People = require('../tables/people');
const Sources = require('../tables/data-sources');

const getContentTypesQuery = (options = {}) => {
  const {
    entityId,
    personId,
  } = options;

  const hasEntityId = Boolean(entityId);
  const hasPersonId = Boolean(personId);

  const clauses = [];
  const selections = [];
  const params = [];

  let id;

  clauses.push('SELECT');

  selections.push(
    `${Incidents.field(Sources.foreignKey())}`,
    `${Incidents.field('contact_type')}`,
  );

  clauses.push(selections.join(', '));
  clauses.push(`FROM ${Incidents.tableName()}`);

  if (hasEntityId || hasPersonId) {
    clauses.push('WHERE');

    if (hasEntityId) {
      id = entityId;

      clauses.push(`${Incidents.field(Entities.foreignKey())} = ?`);
      params.push(entityId);
    } else if (hasPersonId) {
      id = personId;

      clauses.push(`${Incidents.primaryKey()} IN (SELECT ${Incidents.foreignKey()} FROM ${IncidentAttendees.tableName()} WHERE ${People.foreignKey()} = ?)`);
      params.push(personId);
    }
  }

  return { clauses, params, id };
};

const getStatsQuery = (options = {}) => {
  const {
    entityId,
    personId,
  } = options;

  const hasEntityId = Boolean(entityId);
  const hasPersonId = Boolean(personId);

  const clauses = [];
  const selections = [];
  const params = [];

  let id;

  clauses.push('SELECT');

  selections.push(
    `${Incidents.field(Sources.foreignKey())}`,
    `COUNT(${Incidents.primaryKey()}) AS total`,
  );

  clauses.push(selections.join(', '));
  clauses.push(`FROM ${Incidents.tableName()}`);

  if (hasEntityId || hasPersonId) {
    clauses.push('WHERE');

    if (hasEntityId) {
      id = entityId;

      clauses.push(`${Incidents.field(Entities.foreignKey())} = ?`);
      params.push(entityId);
    } else if (hasPersonId) {
      id = personId;

      clauses.push(`${Incidents.primaryKey()} IN (SELECT ${Incidents.foreignKey()} FROM ${IncidentAttendees.tableName()} WHERE ${People.foreignKey()} = ?)`);
      params.push(personId);
    }
  }

  clauses.push(`GROUP BY ${Incidents.field(Sources.foreignKey())}`);
  clauses.push(`ORDER BY ${Incidents.field(Sources.foreignKey())} ASC`);

  return { clauses, params, id };
};

module.exports = {
  getContentTypesQuery,
  getStatsQuery,
};
