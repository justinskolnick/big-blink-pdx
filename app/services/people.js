const paramHelper = require('../helpers/param');
const queryHelper = require('../helpers/query');
const IncidentAttendee = require('../models/incident-attendee');
const Person = require('../models/person');
const db = require('../services/db');

const { SORT_ASC, SORT_DESC } = paramHelper;

const getAllQuery = (options = {}) => {
  const {
    includeCount = false,
    page,
    perPage,
    role,
    sort,
    sortBy,
  } = options;

  const clauses = [];
  const selections = [];
  const params = [];

  clauses.push('SELECT');

  selections.push(...Person.fields());

  if (includeCount) {
    selections.push(`COUNT(${IncidentAttendee.tableName}.id) AS total`);
  }

  clauses.push(selections.join(', '));
  clauses.push(`FROM ${Person.tableName}`);

  if (includeCount || role) {
    clauses.push(`LEFT JOIN ${IncidentAttendee.tableName}`);
    clauses.push(`ON ${IncidentAttendee.tableName}.person_id = ${Person.tableName}.id`);

    if (role) {
      clauses.push(`WHERE ${IncidentAttendee.tableName}.role = ?`);
      params.push(role);
    }

    clauses.push(`GROUP BY ${Person.tableName}.id`);
  }

  clauses.push('ORDER BY');

  if (includeCount && sortBy === paramHelper.SORT_BY_TOTAL) {
    clauses.push(`total ${sort || SORT_DESC}, ${Person.tableName}.family ASC, ${Person.tableName}.given ASC`);
  } else {
    clauses.push(`${Person.tableName}.family ${sort || SORT_ASC}, ${Person.tableName}.given ${sort || SORT_ASC}`);
  }

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

  return results.map(result => Person.adapt(result));
};

const getAtIdQuery = (id) => {
  const clauses = [];
  const selections = [];
  const params = [];

  clauses.push('SELECT');

  selections.push(...Person.fields());
  selections.push(`GROUP_CONCAT(distinct ${IncidentAttendee.tableName}.role) AS roles`);

  clauses.push(selections.join(', '));

  clauses.push(`FROM ${Person.tableName}`);
  clauses.push(`LEFT JOIN ${IncidentAttendee.tableName} ON ${IncidentAttendee.tableName}.person_id = ${Person.tableName}.id`);
  clauses.push(`WHERE ${Person.tableName}.id = ?`);

  params.push(id);

  clauses.push('LIMIT 1');

  return { clauses, params };
};

const getAtId = async (id) => {
  const { clauses, params } = getAtIdQuery(id);
  const result = await db.get(clauses, params);

  return Person.adapt(result);
};

const getTotalQuery = () => `SELECT COUNT(id) AS total FROM ${Person.tableName}`;

const getTotal = async () => {
  const sql = getTotalQuery();
  const result = await db.get(sql);

  return result.total;
};

module.exports = {
  getAll,
  getAllQuery,
  getAtId,
  getAtIdQuery,
  getTotal,
  getTotalQuery,
};
