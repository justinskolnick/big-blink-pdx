const queryHelper = require('../../helpers/query');

const Entity = require('../../models/entity/entity');
const Incident = require('../../models/incident');
const Source = require('../../models/source');
const Quarter = require('../../models/quarter');

const buildQuery = (options = {}) => {
  const {
    includeTotal = false,
    includeTotalOnly = false,
    types = [],
  } = options;

  const clauses = [];
  const selections = [];
  const params = [];

  clauses.push('SELECT');

  if (includeTotalOnly) {
    clauses.push(`COUNT(${Source.primaryKey()}) AS total`);
  } else {
    selections.push(...Source.fields());

    if (includeTotal) {
      selections.push(`COUNT(${Incident.primaryKey()}) AS total`);
    }

    clauses.push(selections.join(', '));
  }

  clauses.push(`FROM ${Source.tableName}`);

  if (includeTotal) {
    clauses.push(queryHelper.leftJoin(Source, Incident));
  }

  if (types.length > 0) {
    clauses.push('WHERE');

    if (types.length > 1) {
      clauses.push('type in (' + Array(types.length).fill('?').join(',') + ')');
    } else {
      clauses.push('type = ?');
    }

    params.push(...types);
  }

  if (!includeTotalOnly) {
    if (includeTotal) {
      clauses.push(`GROUP BY ${Incident.field(Source.foreignKey())}`);
    }

    clauses.push(`ORDER BY ${Source.field('id')} ASC`);
  }

  return { clauses, params };
};

const getAllQuery = (options = {}) => buildQuery(options);

const getAtIdQuery = (id) => {
  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(Source.fields().join(', '));
  clauses.push(`FROM ${Source.tableName}`);
  clauses.push('WHERE');
  clauses.push('id = ?');
  params.push(id);

  clauses.push('LIMIT 1');

  return { clauses, params };
};

const buildEntitiesForIdQuery = (options = {}) => {
  const {
    id,
    includeTotalOnly = false,
    limit,
  } = options;

  const hasLimit = Boolean(limit);

  const clauses = [];
  const selections = [];
  const params = [];

  clauses.push('SELECT');

  if (includeTotalOnly) {
    clauses.push(`COUNT(DISTINCT ${Incident.field(Entity.foreignKey())}) AS total`);
  } else {
    selections.push(`${Entity.field('id')}`);
    selections.push(`${Entity.field('name')}`);
    selections.push(`COUNT(${Incident.field(Entity.foreignKey())}) AS total`);

    clauses.push(selections.join(', '));
  }

  clauses.push(`FROM ${Incident.tableName}`);
  clauses.push(queryHelper.leftJoin(Incident, Entity, true));
  clauses.push('WHERE');
  clauses.push(`${Incident.field(Source.foreignKey())} = ?`);
  params.push(id);

  if (!includeTotalOnly) {
    clauses.push(`GROUP BY ${Incident.field(Entity.foreignKey())}`);
    clauses.push('ORDER BY total DESC');
  }

  if (hasLimit) {
    clauses.push('LIMIT ?');
    params.push(limit);
  }

  return { clauses, params };
};

const getEntitiesForIdQuery = (id, limit = null) => buildEntitiesForIdQuery({ id, limit });

const getEntitiesTotalForIdQuery = (id) => buildEntitiesForIdQuery({
  id,
  includeTotalOnly: true,
});

const getIdForQuarterQuery = (quarterSlug) => {
  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(Source.field('id'));
  clauses.push(`FROM ${Source.tableName}`);
  clauses.push(queryHelper.leftJoin(Source, Quarter, true));
  clauses.push('WHERE');
  clauses.push(`${Quarter.field('slug')} = ?`);
  params.push(quarterSlug);

  clauses.push('AND');
  clauses.push('type = ?');
  params.push(Source.types.activity);

  clauses.push('LIMIT 1');

  return { clauses, params };
};

const getStatsQuery = () => {
  const clauses = [];
  const columns = [];
  const params = [];

  clauses.push('SELECT');
  columns.push(
    `${Source.field('id')}`,
    `${Source.field('year')}`,
    `${Source.field('quarter')}`,
    `COUNT(${Incident.primaryKey()}) AS total`
  );

  clauses.push(columns.join(', '));
  clauses.push(`FROM ${Source.tableName}`);
  clauses.push(queryHelper.leftJoin(Source, Incident));
  clauses.push('WHERE');
  clauses.push('type = ?');
  params.push(Source.types.activity);
  clauses.push(`GROUP BY ${Incident.field(Source.foreignKey())}`);
  clauses.push(`ORDER BY ${Source.field('id')} ASC`);

  return { clauses, params };
};

const getTotalQuery = (options = {}) => buildQuery({
  ...options,
  includeTotalOnly: true,
});

module.exports = {
  getAllQuery,
  getAtIdQuery,
  getEntitiesForIdQuery,
  getEntitiesTotalForIdQuery,
  getIdForQuarterQuery,
  getStatsQuery,
  getTotalQuery,
};
