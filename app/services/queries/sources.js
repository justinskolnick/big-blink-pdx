const queryHelper = require('../../helpers/query');

const Entities = require('../tables/entities');
const Incidents = require('../tables/incidents');
const Sources = require('../tables/data-sources');
const Quarters = require('../tables/quarters');

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
    clauses.push(`COUNT(${Sources.primaryKey()}) AS total`);
  } else {
    selections.push(...Sources.fields());

    if (includeTotal) {
      selections.push(`COUNT(${Incidents.primaryKey()}) AS total`);
    }

    clauses.push(selections.join(', '));
  }

  clauses.push(`FROM ${Sources.tableName()}`);

  if (includeTotal) {
    clauses.push(queryHelper.leftJoin(Sources, Incidents));
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
      clauses.push(`GROUP BY ${Incidents.field(Sources.foreignKey())}`);
    }

    clauses.push(`ORDER BY ${Sources.field('id')} ASC`);
  }

  return { clauses, params };
};

const getAllQuery = (options = {}) => buildQuery(options);

const getAtIdQuery = (id) => {
  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(Sources.fields().join(', '));
  clauses.push(`FROM ${Sources.tableName()}`);
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
  const sortColumns = [];
  const params = [];

  clauses.push('SELECT');

  if (includeTotalOnly) {
    clauses.push(`COUNT(DISTINCT ${Incidents.field(Entities.foreignKey())}) AS total`);
  } else {
    selections.push(`${Entities.field('id')}`);
    selections.push(`${Entities.field('name')}`);
    selections.push(`COUNT(${Incidents.field(Entities.foreignKey())}) AS total`);

    clauses.push(selections.join(', '));
  }

  clauses.push(`FROM ${Incidents.tableName()}`);
  clauses.push(queryHelper.leftJoin(Incidents, Entities, true));
  clauses.push('WHERE');
  clauses.push(`${Incidents.field(Sources.foreignKey())} = ?`);
  params.push(id);

  if (!includeTotalOnly) {
    clauses.push(`GROUP BY ${Incidents.field(Entities.foreignKey())}`);
  }

  clauses.push('ORDER BY');

  if (!includeTotalOnly) {
    sortColumns.push('total DESC');
  }

  sortColumns.push(`${Entities.field('name')} ASC`);

  clauses.push(sortColumns.join(', '));

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
  clauses.push(Sources.field('id'));
  clauses.push(`FROM ${Sources.tableName()}`);
  clauses.push(queryHelper.leftJoin(Sources, Quarters, true));
  clauses.push('WHERE');
  clauses.push(`${Quarters.field('slug')} = ?`);
  params.push(quarterSlug);

  clauses.push('AND');
  clauses.push('type = ?');
  params.push(Sources.types.activity);

  clauses.push('LIMIT 1');

  return { clauses, params };
};

const getStatsQuery = () => {
  const clauses = [];
  const columns = [];
  const params = [];

  clauses.push('SELECT');
  columns.push(
    `${Sources.field('id')}`,
    `${Sources.field('year')}`,
    `${Sources.field('quarter')}`,
    `COUNT(${Incidents.primaryKey()}) AS total`
  );

  clauses.push(columns.join(', '));
  clauses.push(`FROM ${Sources.tableName()}`);
  clauses.push(queryHelper.leftJoin(Sources, Incidents));
  clauses.push('WHERE');
  clauses.push('type = ?');
  params.push(Sources.types.activity);
  clauses.push(`GROUP BY ${Incidents.field(Sources.foreignKey())}`);
  clauses.push(`ORDER BY ${Sources.field('id')} ASC`);

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
