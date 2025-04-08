const { SORT_ASC } = require('../../config/constants');

const queryHelper = require('../../helpers/query');
const Incident = require('../../models/incident');
const IncidentAttendee = require('../../models/incident-attendee');

const getAllQuery = (options = {}) => {
  const {
    page,
    perPage,
    personId,
    dateOn,
    dateRangeFrom,
    dateRangeTo,
    quarterSourceId,
    sort = SORT_ASC,
    withEntityId,
    withPersonId,
  } = options;
  const hasDateOn = Boolean(dateOn);
  const hasDateRange = Boolean(dateRangeFrom && dateRangeTo);
  const hasPersonId = Boolean(personId);

  const clauses = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(Incident.fields().join(', '));
  clauses.push(`FROM ${Incident.tableName}`);
  clauses.push(`LEFT JOIN ${IncidentAttendee.tableName}`);
  clauses.push(`ON ${Incident.primaryKey()} = ${IncidentAttendee.field('incident_id')}`);

  if (hasDateOn || hasDateRange || hasPersonId || withEntityId || withPersonId) {
    clauses.push('WHERE');

    if (hasPersonId) {
      clauses.push(`${IncidentAttendee.field('person_id')} = ?`);
      params.push(personId);

      if (quarterSourceId) {
        clauses.push('AND');
        clauses.push(`${Incident.field('data_source_id')} = ?`);
        params.push(quarterSourceId);
      }
    }

    if (hasDateOn || hasDateRange) {
      if (hasPersonId || quarterSourceId) {
        clauses.push('AND');
      }

      if (hasDateOn) {
        clauses.push(`${Incident.field('contact_date')} = ?`);
        params.push(dateOn);
      } else if (hasDateRange) {
        clauses.push(`${Incident.field('contact_date')} BETWEEN ? AND ?`);
        params.push(dateRangeFrom, dateRangeTo);
      }
    }

    if (hasPersonId && (withEntityId || withPersonId)) {
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

const getTotalQuery = (options = {}) => {
  const {
    dateOn,
    dateRangeFrom,
    dateRangeTo,
    personId,
    quarterSourceId,
    withEntityId,
    withPersonId,
  } = options;
  const hasDateOn = Boolean(dateOn);
  const hasDateRange = Boolean(dateRangeFrom && dateRangeTo);

  const clauses = [];
  const params = [];

  if (personId) {
    if (withPersonId) {
      const statement = `SELECT incident_id AS id FROM ${IncidentAttendee.tableName} WHERE ${IncidentAttendee.field('person_id')} = ?`;
      const statements = `(${statement}) INTERSECT (${statement})`;

      clauses.push('SELECT');
      clauses.push('COUNT(id) AS total');
      clauses.push('FROM');

      params.push(personId, withPersonId);

      if (hasDateOn || hasDateRange) {
        const dateClauses = [];

        dateClauses.push(`SELECT ${Incident.primaryKey()} FROM ${Incident.tableName} WHERE`);

        if (hasDateOn) {
          dateClauses.push(`${Incident.field('contact_date')} = ?`);
          params.push(dateOn);
        } else if (hasDateRange) {
          dateClauses.push(`${Incident.field('contact_date')} BETWEEN ? AND ?`);
          params.push(dateRangeFrom, dateRangeTo);
        }

        const dateStatement = dateClauses.join(' ');

        clauses.push(`((${statements}) INTERSECT (${dateStatement}))`);
      } else {
        clauses.push(`(${statements})`);
      }

      clauses.push('AS total');
    } else {
      clauses.push('SELECT');
      clauses.push(`COUNT(${IncidentAttendee.primaryKey()}) AS total`);
      clauses.push(`FROM ${IncidentAttendee.tableName}`);

      if (hasDateOn || hasDateRange || quarterSourceId || withEntityId) {
        clauses.push(`LEFT JOIN ${Incident.tableName}`);
        clauses.push(`ON ${Incident.primaryKey()} = ${IncidentAttendee.field('incident_id')}`);
      }

      clauses.push('WHERE');
      clauses.push(`${IncidentAttendee.field('person_id')} = ?`);
      params.push(personId);

      if (quarterSourceId || withEntityId) {
        clauses.push('AND');
      }

      if (quarterSourceId) {
        clauses.push(`${Incident.field('data_source_id')} = ?`);
        params.push(quarterSourceId);
      } else if (withEntityId) {
        clauses.push(`${Incident.field('entity_id')} = ?`);
        params.push(withEntityId);
      }

      if (hasDateOn || hasDateRange) {
        clauses.push('AND');

        if (hasDateOn) {
          clauses.push(`${Incident.field('contact_date')} = ?`);
          params.push(dateOn);
        } else if (hasDateRange) {
          clauses.push(`${Incident.field('contact_date')} BETWEEN ? AND ?`);
          params.push(dateRangeFrom, dateRangeTo);
        }
      }
    }
  }

  return { clauses, params };
};

module.exports = {
  getAllQuery,
  getTotalQuery,
};
