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
    selections.push(`COUNT(${IncidentAttendee.primaryKey()}) AS total`);
  }

  clauses.push(selections.join(', '));
  clauses.push(`FROM ${Person.tableName}`);

  if (includeCount || role) {
    clauses.push(`LEFT JOIN ${IncidentAttendee.tableName}`);
    clauses.push(`ON ${IncidentAttendee.field('person_id')} = ${Person.primaryKey()}`);

    if (role) {
      clauses.push(`WHERE ${IncidentAttendee.field('role')} = ?`);
      params.push(role);
    }

    clauses.push(`GROUP BY ${Person.primaryKey()}`);
  }

  clauses.push('ORDER BY');

  if (includeCount && sortBy === paramHelper.SORT_BY_TOTAL) {
    clauses.push(`total ${sort || SORT_DESC}, ${Person.field('family')} ASC, ${Person.field('given')} ASC`);
  } else {
    clauses.push(`${Person.field('family')} ${sort || SORT_ASC}, ${Person.field('given')} ${sort || SORT_ASC}`);
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

  return results.map(result => {
    const person = new Person(result);

    return person.adapted;
  });
};

const getAtIdQuery = (id) => {
  const clauses = [];
  const selections = [];
  const params = [];

  clauses.push('SELECT');

  selections.push(...Person.fields());
  selections.push(`GROUP_CONCAT(distinct ${IncidentAttendee.field('role')}) AS roles`);

  clauses.push(selections.join(', '));

  clauses.push(`FROM ${Person.tableName}`);
  clauses.push(`LEFT JOIN ${IncidentAttendee.tableName} ON ${IncidentAttendee.field('person_id')} = ${Person.primaryKey()}`);
  clauses.push(`WHERE ${Person.field('id')} = ?`);

  params.push(id);

  clauses.push('LIMIT 1');

  return { clauses, params };
};

const getAtId = async (id) => {
  const { clauses, params } = getAtIdQuery(id);
  const result = await db.get(clauses, params);
  const person = new Person(result);

  return person.adapted;
};

const getTotalQuery = () => `SELECT COUNT(${Person.primaryKey()}) AS total FROM ${Person.tableName}`;

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
