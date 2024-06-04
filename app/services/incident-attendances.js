const paramHelper = require('../helpers/param');
const queryHelper = require('../helpers/query');
const Incident = require('../models/incident');
const IncidentAttendee = require('../models/incident-attendee');
const db = require('../services/db');

const { SORT_ASC } = paramHelper;

const getAllQuery = (options = {}) => {
  const {
    page,
    perPage,
    personId,
    quarterSourceId,
    sort = SORT_ASC,
    withEntityId,
    withPersonId,
  } = options;

  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(Incident.fields().join(', '));
  clauses.push(`FROM ${Incident.tableName}`);
  clauses.push(`LEFT JOIN ${IncidentAttendee.tableName}`);
  clauses.push(`ON ${Incident.primaryKey()} = ${IncidentAttendee.field('incident_id')}`);

  if (personId || withEntityId || withPersonId) {
    clauses.push('WHERE');

    if (personId) {
      clauses.push(`${IncidentAttendee.field('person_id')} = ?`);
      params.push(personId);
    }

    if (personId && quarterSourceId) {
      clauses.push('AND');
      clauses.push(`${Incident.field('data_source_id')} = ?`);
      params.push(quarterSourceId);
    }

    if (personId && (withEntityId || withPersonId)) {
      clauses.push('AND');

      if (withEntityId) {
        clauses.push(`${Incident.field('entity_id')} = ?`);
        params.push(withEntityId);
      }

      if (withPersonId) {
        const withClauses = [
          `SELECT ${IncidentAttendee.field('incident_id')}`,
          `FROM ${IncidentAttendee.tableName}`,
          `WHERE ${IncidentAttendee.field('person_id')} = ?`,
        ];
        const statement = withClauses.join(' ');

        clauses.push(`${Incident.primaryKey()} IN (${statement} INTERSECT ${statement})`);
        params.push(personId, withPersonId);
      }
    }
  }

  clauses.push('ORDER BY');
  clauses.push(`${Incident.field('contact_date')}`);
  clauses.push(sort);

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

  return results.map(result => Incident.adapt(result));
};

const getTotalQuery = (options = {}) => {
  const { personId, quarterSourceId, withEntityId, withPersonId } = options;

  const clauses = [];
  const params = [];

  if (personId) {
    if (withPersonId) {
      const statement = `SELECT incident_id AS id FROM ${IncidentAttendee.tableName} WHERE person_id = ?`;

      clauses.push('SELECT');
      clauses.push('COUNT(id) AS total');
      clauses.push(`FROM ((${statement}) INTERSECT (${statement})) AS total`);
      params.push(personId, withPersonId);
    } else if (withEntityId) {
      clauses.push('SELECT');
      clauses.push(`COUNT(${IncidentAttendee.primaryKey()}) AS total`);
      clauses.push(`FROM ${IncidentAttendee.tableName}`);
      clauses.push(`LEFT JOIN ${Incident.tableName}`);
      clauses.push(`ON ${Incident.primaryKey()} = ${IncidentAttendee.field('incident_id')}`);
      clauses.push('WHERE');
      clauses.push(`${IncidentAttendee.field('person_id')} = ?`);
      params.push(personId);

      clauses.push('AND');
      clauses.push(`${Incident.field('entity_id')} = ?`);
      params.push(withEntityId);
    } else {
      clauses.push('SELECT');
      clauses.push(`COUNT(${IncidentAttendee.primaryKey()}) AS total`);
      clauses.push(`FROM ${IncidentAttendee.tableName}`);

      if (quarterSourceId) {
        clauses.push(`LEFT JOIN ${Incident.tableName}`);
        clauses.push(`ON ${Incident.primaryKey()} = ${IncidentAttendee.field('incident_id')}`);
        clauses.push('WHERE');
        clauses.push(`${Incident.field('data_source_id')} = ?`);
        params.push(quarterSourceId);

        clauses.push('AND');
        clauses.push(`${IncidentAttendee.field('person_id')} = ?`);
        params.push(personId);
      } else {
        clauses.push('WHERE');
        clauses.push(`${IncidentAttendee.field('person_id')} = ?`);
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
