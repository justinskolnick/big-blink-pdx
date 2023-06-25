const dateHelper = require('../helpers/date');
const queryHelper = require('../helpers/query');
const {
  FIELDS: INCIDENTS_FIELDS,
  TABLE: INCIDENTS_TABLE,
} = require('../models/incidents');
const {
  TABLE: INCIDENT_ATTENDEES_TABLE,
} = require('../models/incident-attendees');
const db = require('../services/db');

const adaptResults = (result) => ({
  id: result.id,
  data_source_id: result.data_source_id, // eslint-disable-line camelcase
  entity: result.entity,
  entityId: result.entity_id,
  contactDate: dateHelper.formatDateString(result.contact_date),
  contactType: result.contact_type,
  category: result.category,
  topic: result.topic,
  officials: result.officials,
  lobbyists: result.lobbyists,
});

const getAllQuery = (options = {}) => {
  const {
    page,
    perPage,
    personId,
    quarterSourceId,
    sort = 'ASC',
    withEntityId,
    withPersonId,
  } = options;

  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(INCIDENTS_FIELDS.map(column => `${INCIDENTS_TABLE}.${column}`).join(', '));
  clauses.push(`FROM ${INCIDENTS_TABLE}`);
  clauses.push(`LEFT JOIN ${INCIDENT_ATTENDEES_TABLE}`);
  clauses.push(`ON ${INCIDENTS_TABLE}.id = ${INCIDENT_ATTENDEES_TABLE}.incident_id`);

  if (personId || withEntityId || withPersonId) {
    clauses.push('WHERE');

    if (personId) {
      clauses.push(`${INCIDENT_ATTENDEES_TABLE}.person_id = ?`);
      params.push(personId);
    }

    if (personId && quarterSourceId) {
      clauses.push('AND');
      clauses.push(`${INCIDENTS_TABLE}.data_source_id = ?`);
      params.push(quarterSourceId);
    }

    if (personId && (withEntityId || withPersonId)) {
      clauses.push('AND');

      if (withEntityId) {
        clauses.push(`${INCIDENTS_TABLE}.entity_id = ?`);
        params.push(withEntityId);
      }

      if (withPersonId) {
        const withClauses = [
          `SELECT ${INCIDENT_ATTENDEES_TABLE}.incident_id`,
          `FROM ${INCIDENT_ATTENDEES_TABLE}`,
          `WHERE ${INCIDENT_ATTENDEES_TABLE}.person_id = ?`,
        ];
        const statement = withClauses.join(' ');

        clauses.push(`${INCIDENTS_TABLE}.id IN (${statement} INTERSECT ${statement})`);
        params.push(personId, withPersonId);
      }
    }
  }

  if (sort === 'ASC') {
    clauses.push(`ORDER BY ${INCIDENTS_TABLE}.contact_date ASC`);
  } else if (sort === 'DESC') {
    clauses.push(`ORDER BY ${INCIDENTS_TABLE}.contact_date DESC`);
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

  return results.map(adaptResults);
};

const getTotalQuery = (options = {}) => {
  const { personId, quarterSourceId, withEntityId, withPersonId } = options;

  const clauses = [];
  const params = [];

  if (personId) {
    if (withPersonId) {
      const statement = `SELECT incident_id AS id FROM ${INCIDENT_ATTENDEES_TABLE} WHERE person_id = ?`;

      clauses.push('SELECT');
      clauses.push('COUNT(id) AS total');
      clauses.push(`FROM ((${statement}) INTERSECT (${statement})) AS total`);
      params.push(personId, withPersonId);
    } else if (withEntityId) {
      clauses.push('SELECT');
      clauses.push(`COUNT(${INCIDENT_ATTENDEES_TABLE}.id) AS total`);
      clauses.push(`FROM ${INCIDENT_ATTENDEES_TABLE}`);
      clauses.push(`LEFT JOIN ${INCIDENTS_TABLE}`);
      clauses.push(`ON ${INCIDENTS_TABLE}.id = ${INCIDENT_ATTENDEES_TABLE}.incident_id`);
      clauses.push('WHERE');
      clauses.push(`${INCIDENT_ATTENDEES_TABLE}.person_id = ?`);
      params.push(personId);

      clauses.push('AND');
      clauses.push(`${INCIDENTS_TABLE}.entity_id = ?`);
      params.push(withEntityId);
    } else {
      clauses.push('SELECT');
      clauses.push(`COUNT(${INCIDENT_ATTENDEES_TABLE}.id) AS total`);
      clauses.push(`FROM ${INCIDENT_ATTENDEES_TABLE}`);

      if (quarterSourceId) {
        clauses.push(`LEFT JOIN ${INCIDENTS_TABLE}`);
        clauses.push(`ON ${INCIDENTS_TABLE}.id = ${INCIDENT_ATTENDEES_TABLE}.incident_id`);
        clauses.push('WHERE');
        clauses.push(`${INCIDENTS_TABLE}.data_source_id = ?`);
        params.push(quarterSourceId);

        clauses.push('AND');
        clauses.push(`${INCIDENT_ATTENDEES_TABLE}.person_id = ?`);
        params.push(personId);
      } else {
        clauses.push('WHERE');
        clauses.push(`${INCIDENT_ATTENDEES_TABLE}.person_id = ?`);
        params.push(personId);
      }
    }
  }

  return { clauses, params };
};

const getTotal = async (options = {}) => {
  const { clauses, params } = getTotalQuery(options);
  const result = await db.get(clauses, params);

  return result.total;
};

module.exports = {
  getAll,
  getAllQuery,
  getTotal,
  getTotalQuery,
};
