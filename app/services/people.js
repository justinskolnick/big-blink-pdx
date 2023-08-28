const paramHelper = require('../helpers/param');
const queryHelper = require('../helpers/query');
const { TABLE: INCIDENT_ATTENDEES_TABLE } = require('../models/incident-attendees');
const { TABLE, FIELDS } = require('../models/people');
const db = require('../services/db');

const { SORT_ASC, SORT_DESC } = paramHelper;

const adaptResult = (result) => {
  const adapted = {
    id: result.id,
    type: result.type,
    name: result.name,
    roles: result.roles?.split(',') ?? [],
  };

  if (result.total) {
    adapted.incidents = {
      total: result.total,
    };
  }

  return adapted;
};

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
  FIELDS.forEach(field => {
    selections.push(`${TABLE}.${field}`);
  });

  if (includeCount) {
    selections.push(`COUNT(${INCIDENT_ATTENDEES_TABLE}.id) AS total`);
  }

  clauses.push(selections.join(', '));
  clauses.push(`FROM ${TABLE}`);

  if (includeCount || role) {
    clauses.push(`LEFT JOIN ${INCIDENT_ATTENDEES_TABLE}`);
    clauses.push(`ON ${INCIDENT_ATTENDEES_TABLE}.person_id = ${TABLE}.id`);

    if (role) {
      clauses.push(`WHERE ${INCIDENT_ATTENDEES_TABLE}.role = ?`);
      params.push(role);
    }

    clauses.push(`GROUP BY ${TABLE}.id`);
  }

  clauses.push('ORDER BY');

  if (includeCount && sortBy === paramHelper.SORT_BY_TOTAL) {
    clauses.push(`total ${sort || SORT_DESC}, ${TABLE}.family ASC, ${TABLE}.given ASC`);
  } else {
    clauses.push(`${TABLE}.family ${sort || SORT_ASC}, ${TABLE}.given ${sort || SORT_ASC}`);
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

  return results.map(adaptResult);
};

const getAtIdQuery = (id) => {
  const clauses = [];
  const selections = [];
  const params = [];

  clauses.push('SELECT');
  FIELDS.forEach(field => {
    selections.push(`${TABLE}.${field}`);
  });
  selections.push(`GROUP_CONCAT(distinct ${INCIDENT_ATTENDEES_TABLE}.role) AS roles`);
  clauses.push(selections.join(', '));

  clauses.push(`FROM ${TABLE}`);
  clauses.push(`LEFT JOIN ${INCIDENT_ATTENDEES_TABLE} ON ${INCIDENT_ATTENDEES_TABLE}.person_id = ${TABLE}.id`);
  clauses.push(`WHERE ${TABLE}.id = ?`);

  params.push(id);

  clauses.push('LIMIT 1');

  return { clauses, params };
};

const getAtId = async (id) => {
  const { clauses, params } = getAtIdQuery(id);
  const result = await db.get(clauses, params);

  return adaptResult(result);
};

const getTotalQuery = () => `SELECT COUNT(id) AS total FROM ${TABLE}`;

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
