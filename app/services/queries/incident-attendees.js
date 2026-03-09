const {
  ASSOCIATION_LOBBYISTS,
  ASSOCIATION_OFFICIALS,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../config/constants');

const queryHelper = require('../../helpers/query');

const Entities = require('../tables/entities');
const Incidents = require('../tables/incidents');
const IncidentAttendees = require('../tables/incident-attendees');
const People = require('../tables/people');
const Sources = require('../tables/data-sources');

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

  selections.push(...IncidentAttendees.fields());
  selections.push(`${People.field('id')} AS ${People.foreignKey()}`);
  selections.push(...IncidentAttendees.personFields(['id']));

  clauses.push(selections.join(', '));

  clauses.push(`FROM ${IncidentAttendees.tableName()}`);
  clauses.push(queryHelper.leftJoin(IncidentAttendees, People, true));

  if (hasIncidentId) {
    clauses.push('WHERE');

    conditions.push(`${IncidentAttendees.field(Incidents.foreignKey())} = ?`);
    params.push(incidentId);

    clauses.push(...queryHelper.joinConditions(conditions));
  }

  clauses.push('ORDER BY');
  clauses.push(`${IncidentAttendees.field('role')} ASC, ${People.field('family')} ASC`);

  if (hasPage && hasPerPage) {
    const offset = queryHelper.getOffset(page, perPage);

    clauses.push('LIMIT ?,?');
    params.push(offset, perPage);
  }

  return { clauses, params };
};

const buildEntitiesQuery = (options = {}, limit = null) => {
  const {
    includeTotalOnly = false,
    personId,
    personRole,
  } = options;

  const hasPersonId = Boolean(personId);
  const hasPersonRole = Boolean(personRole);
  const hasLimit = Number.isInteger(limit);

  const clauses = [];
  const selections = [];
  const sorting = [];
  const params = [];

  clauses.push('SELECT');

  if (includeTotalOnly) {
    clauses.push(`COUNT(DISTINCT ${Entities.primaryKey()}) AS total`);
  } else {
    selections.push(Entities.field('id'));
    selections.push(Entities.field('name'));
    selections.push(`COUNT(${Incidents.field(Entities.foreignKey())}) AS total`);

    clauses.push(selections.join(', '));
  }

  clauses.push(`FROM ${Incidents.tableName()}`);
  clauses.push(queryHelper.leftJoin(Incidents, Entities, true));

  if (hasPersonId) {
    const subqueryClauses = [];

    subqueryClauses.push('SELECT');
    subqueryClauses.push(`${IncidentAttendees.field(Incidents.foreignKey())} AS id`);
    subqueryClauses.push(`FROM ${IncidentAttendees.tableName()}`);
    subqueryClauses.push('WHERE');
    subqueryClauses.push(`${IncidentAttendees.field(People.foreignKey())} = ?`);
    params.push(personId);

    if (hasPersonRole) {
      subqueryClauses.push('AND');
      subqueryClauses.push(`${IncidentAttendees.field('role')} = ?`);
      params.push(personRole);
    }

    clauses.push('WHERE');
    clauses.push(`${Incidents.primaryKey()} IN (${subqueryClauses.join(' ')})`);
  }

  if (!includeTotalOnly) {
    clauses.push('GROUP BY');
    clauses.push(Incidents.field(Entities.foreignKey()));
  }

  sorting.push('total DESC');

  if (!includeTotalOnly) {
    sorting.push(`${Entities.field('name')} ASC`);
  }

  clauses.push('ORDER BY');
  clauses.push(sorting.join(', '));

  if (hasLimit) {
    clauses.push('LIMIT ?');
    params.push(limit);
  }

  return { clauses, params };
};

const getEntitiesQuery = (options = {}, limit = null) => buildEntitiesQuery(options, limit);

const getEntitiesTotalQuery = (options = {}) => buildEntitiesQuery({
  ...options,
  includeTotalOnly: true,
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
  clauses.push(`IF(COUNT(${IncidentAttendees.primaryKey()}) > 0, 'true', 'false') AS hasLobbiedOrBeenLobbied`);

  clauses.push(`FROM ${IncidentAttendees.tableName()}`);

  if (hasPersonId && hasRole) {
    clauses.push('WHERE');
    conditions.push(`${IncidentAttendees.field('role')} = ?`);
    params.push(role);

    conditions.push(`${IncidentAttendees.field(People.foreignKey())} = ?`);
    params.push(personId);
  }

  if (conditions.length) {
    clauses.push(...queryHelper.joinConditions(conditions));
  }

  return { clauses, params };
};

const buildPeopleQuery = (options = {}, limit = null) => {
  const {
    association,
    entityId,
    includeTotal,
    includeTotalOnly = false,
    personId,
    personRole,
    role,
    sourceId,
  } = options;

  const hasAssociation = Boolean(association);
  const hasEntityId = Boolean(entityId);
  const hasPersonId = Boolean(personId);
  const hasPersonRole = Boolean(personRole);
  const hasRole = Boolean(role);
  const hasSourceId = Boolean(sourceId);
  const hasLimit = Number.isInteger(limit);

  const clauses = [];
  const selections = [];
  const sorting = [];
  const conditions = [];
  const params = [];

  clauses.push('SELECT');

  if (includeTotalOnly) {
    clauses.push(`COUNT(DISTINCT ${IncidentAttendees.field(People.foreignKey())}) AS total`);
  } else {
    selections.push(`${IncidentAttendees.field(People.foreignKey())} AS id`);
    selections.push(People.field('name'));
    selections.push(People.field('type'));

    if (includeTotal) {
      selections.push(`COUNT(${IncidentAttendees.field(People.foreignKey())}) AS total`);
    }

    clauses.push(selections.join(', '));
  }

  clauses.push(`FROM ${IncidentAttendees.tableName()}`);
  clauses.push(queryHelper.leftJoin(IncidentAttendees, People, true));

  if (hasAssociation || hasEntityId || hasPersonId || hasRole || hasSourceId) {
    const subqueryClauses = [];

    clauses.push('WHERE');

    if (hasEntityId || hasSourceId) {
      subqueryClauses.push('SELECT');
      subqueryClauses.push(Incidents.field('id'));
      subqueryClauses.push(`FROM ${Incidents.tableName()}`);
      subqueryClauses.push('WHERE');

      if (hasEntityId) {
        subqueryClauses.push(`${Incidents.field(Entities.foreignKey())} = ?`);
        params.push(entityId);
      }

      if (hasSourceId) {
        subqueryClauses.push(`${Incidents.field(Sources.foreignKey())} = ?`);
        params.push(sourceId);
      }
    }

    if (hasPersonId) {
      subqueryClauses.push('SELECT');
      subqueryClauses.push(`${IncidentAttendees.field(Incidents.foreignKey())} AS id`);
      subqueryClauses.push(`FROM ${IncidentAttendees.tableName()}`);
      subqueryClauses.push('WHERE');
      subqueryClauses.push(`${IncidentAttendees.field(People.foreignKey())} = ?`);
      params.push(personId);

      if (hasPersonRole) {
        subqueryClauses.push('AND');
        subqueryClauses.push(`${IncidentAttendees.field('role')} = ?`);
        params.push(personRole);
      }
    }

    if (subqueryClauses.length) {
      conditions.push(`${IncidentAttendees.field(Incidents.foreignKey())} IN (${subqueryClauses.join(' ')})`);
    }

    if (hasAssociation || hasRole) {
      conditions.push(`${IncidentAttendees.field('role')} = ?`);

      if (hasAssociation) {
        if (association === ASSOCIATION_LOBBYISTS) {
          params.push(ROLE_LOBBYIST);
        } else if (association === ASSOCIATION_OFFICIALS) {
          params.push(ROLE_OFFICIAL);
        }
      } else {
        params.push(role);
      }
    }

    if (hasPersonId) {
      conditions.push(`${IncidentAttendees.field(People.foreignKey())} != ?`);
      params.push(personId);
    }
  }

  clauses.push(...queryHelper.joinConditions(conditions));

  if (!includeTotalOnly) {
    if (includeTotal) {
      clauses.push('GROUP BY');
      clauses.push(IncidentAttendees.field(People.foreignKey()));
    }

    if (includeTotal) {
      sorting.push('total DESC');
      sorting.push(`${People.field('family')} ASC`);
    } else {
      sorting.push(`${IncidentAttendees.field(People.foreignKey())} ASC`);
    }

    clauses.push('ORDER BY');
    clauses.push(sorting.join(', '));
  }

  if (hasLimit) {
    clauses.push('LIMIT ?');
    params.push(limit);
  }

  return { clauses, params };
};

const getPeopleQuery = (options = {}, limit = null) => buildPeopleQuery(options, limit);

const getPeopleTotalQuery = (options = {}) => buildPeopleQuery({
  ...options,
  includeTotalOnly: true,
});

module.exports = {
  getAllQuery,
  getEntitiesQuery,
  getEntitiesTotalQuery,
  getHasLobbiedOrBeenLobbiedQuery,
  getPeopleQuery,
  getPeopleTotalQuery,
};
