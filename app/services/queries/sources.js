const Entity = require('../../models/entity');
const Incident = require('../../models/incident');
const Source = require('../../models/source');
const Quarter = require('../../models/quarter');

const buildQuery = (options = {}) => {
  const {
    includeCount = false,
    totalOnly = false,
    types = [],
  } = options;

  const clauses = [];
  const selections = [];
  const params = [];

  clauses.push('SELECT');

  if (totalOnly) {
    clauses.push(`COUNT(${Source.primaryKey()}) AS total`);
  } else {
    selections.push(...Source.fields());

    if (includeCount) {
      selections.push(`COUNT(${Incident.primaryKey()}) AS total`);
    }

    clauses.push(selections.join(', '));
  }

  clauses.push(`FROM ${Source.tableName}`);

  if (includeCount) {
    clauses.push(`LEFT JOIN ${Incident.tableName} ON ${Incident.tableName}.data_source_id = ${Source.primaryKey()}`);
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

  if (!totalOnly) {
    if (includeCount) {
      clauses.push(`GROUP BY ${Incident.tableName}.data_source_id`);
    }

    clauses.push(`ORDER BY ${Source.tableName}.id ASC`);
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

const getEntitiesForIdQuery = (id) => {
  const clauses = [];
  const selections = [];
  const params = [];

  clauses.push('SELECT');

  selections.push(`${Entity.field('id')}`);
  selections.push(`${Entity.field('name')}`);
  selections.push(`COUNT(${Incident.field('entity_id')}) AS total`);

  clauses.push(selections.join(', '));

  clauses.push(`FROM ${Incident.tableName}`);
  clauses.push(`LEFT JOIN ${Entity.tableName} ON ${Incident.field('entity_id')} = ${Entity.primaryKey()}`);
  clauses.push('WHERE');
  clauses.push(`${Incident.field('data_source_id')} = ?`);
  params.push(id);

  clauses.push(`GROUP BY ${Incident.field('entity_id')}`);
  clauses.push('ORDER BY total DESC');

  return { clauses, params };
};

const getIdForQuarterQuery = (quarterSlug) => {
  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(Source.field('id'));
  clauses.push(`FROM ${Source.tableName}`);
  clauses.push(`LEFT JOIN ${Quarter.tableName} ON ${Source.field('quarter_id')} = ${Quarter.primaryKey()}`);
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
  clauses.push(`LEFT JOIN ${Incident.tableName} ON ${Incident.field('data_source_id')} = ${Source.primaryKey()}`);
  clauses.push('WHERE');
  clauses.push('type = ?');
  params.push(Source.types.activity);
  clauses.push(`GROUP BY ${Incident.field('data_source_id')}`);
  clauses.push(`ORDER BY ${Source.field('id')} ASC`);

  return { clauses, params };
};

const getTotalQuery = (options = {}) => {
  options.totalOnly = true;

  return buildQuery(options);
};

module.exports = {
  getAllQuery,
  getAtIdQuery,
  getEntitiesForIdQuery,
  getIdForQuarterQuery,
  getStatsQuery,
  getTotalQuery,
};
