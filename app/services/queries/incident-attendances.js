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
  const hasSourceId = Boolean(quarterSourceId);
  const hasEntityId = Boolean(withEntityId);
  const hasWithPersonId = Boolean(withPersonId);

  const hasForeignKeyOption = hasEntityId || hasPersonId || hasSourceId;
  const hasDateOption = hasDateOn || hasDateRange /*|| hasYear*/;

  const clauses = [];
  const conditions = [];
  const params = [];

  clauses.push('SELECT');
  clauses.push(Incident.fields().join(', '));
  clauses.push(`FROM ${Incident.tableName}`);
  clauses.push(`LEFT JOIN ${IncidentAttendee.tableName}`);
  clauses.push(`ON ${Incident.primaryKey()} = ${IncidentAttendee.field('incident_id')}`);

  if (hasForeignKeyOption || hasDateOption || hasWithPersonId) {
    clauses.push('WHERE');

    if (hasEntityId) {
      conditions.push(`${Incident.field('entity_id')} = ?`);
      params.push(withEntityId);
    }

    if (hasPersonId) {
      conditions.push(`${IncidentAttendee.field('person_id')} = ?`);
      params.push(personId);
    }

    if (hasSourceId) {
      conditions.push(`${Incident.field('data_source_id')} = ?`);
      params.push(quarterSourceId);
    }

    if (hasDateOn) {
      const dateClauseSegments = Incident.dateRangeFields().map(fieldName => (
        `${fieldName} = ?`
      )).join(' OR ');

      conditions.push(`(${dateClauseSegments})`);
      params.push(dateOn, dateOn);
    } else if (hasDateRange) {
      const dateClauseSegments = Incident.dateRangeFields().map(fieldName => (
        `${fieldName} BETWEEN ? AND ?`
      )).join(' OR ');

      conditions.push(`(${dateClauseSegments})`);
      params.push(dateRangeFrom, dateRangeTo, dateRangeFrom, dateRangeTo);
    }

    if (hasPersonId && hasWithPersonId) {
      if (hasWithPersonId) {
        const withClauses = [
          `SELECT ${IncidentAttendee.field('incident_id')}`,
          `FROM ${IncidentAttendee.tableName}`,
          `WHERE ${IncidentAttendee.field('person_id')} = ?`,
        ];
        const statement = withClauses.join(' ');

        conditions.push(`${Incident.primaryKey()} IN (${statement} INTERSECT ${statement})`);
        params.push(personId, withPersonId);
      }
    }
  }

  queryHelper.joinConditions(conditions).forEach(condition => {
    clauses.push(condition);
  });

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
  const hasPersonId = Boolean(personId);
  const hasQuarterSourceId = Boolean(quarterSourceId);
  const hasWithEntityId = Boolean(withEntityId);
  const hasWithPersonId = Boolean(withPersonId);

  const clauses = [];
  const conditions = [];
  const params = [];

  if (hasPersonId) {
    if (hasWithPersonId) {
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
          const dateClauseSegments = Incident.dateRangeFields().map(fieldName => (
            `${fieldName} = ?`
          )).join(' OR ');

          dateClauses.push(`(${dateClauseSegments})`);
          params.push(dateOn, dateOn);
        } else if (hasDateRange) {
          const dateClauseSegments = Incident.dateRangeFields().map(fieldName => (
            `${fieldName} BETWEEN ? AND ?`
          )).join(' OR ');

          dateClauses.push(`(${dateClauseSegments})`);
          params.push(dateRangeFrom, dateRangeTo, dateRangeFrom, dateRangeTo);
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

      if (hasDateOn || hasDateRange || hasQuarterSourceId || hasWithEntityId) {
        clauses.push(`LEFT JOIN ${Incident.tableName}`);
        clauses.push(`ON ${Incident.primaryKey()} = ${IncidentAttendee.field('incident_id')}`);
      }

      clauses.push('WHERE');

      conditions.push(`${IncidentAttendee.field('person_id')} = ?`);
      params.push(personId);

      if (hasQuarterSourceId) {
        conditions.push(`${Incident.field('data_source_id')} = ?`);
        params.push(quarterSourceId);
      } else if (hasWithEntityId) {
        conditions.push(`${Incident.field('entity_id')} = ?`);
        params.push(withEntityId);
      }

      if (hasDateOn) {
        const dateClauseSegments = Incident.dateRangeFields().map(fieldName => (
          `${fieldName} = ?`
        )).join(' OR ');

        conditions.push(`(${dateClauseSegments})`);
        params.push(dateOn, dateOn);
      } else if (hasDateRange) {
        const dateClauseSegments = Incident.dateRangeFields().map(fieldName => (
          `${fieldName} BETWEEN ? AND ?`
        )).join(' OR ');

        conditions.push(`(${dateClauseSegments})`);
        params.push(dateRangeFrom, dateRangeTo, dateRangeFrom, dateRangeTo);
      }

      queryHelper.joinConditions(conditions).forEach(condition => {
        clauses.push(condition);
      });
    }
  }

  return { clauses, params };
};

module.exports = {
  getAllQuery,
  getTotalQuery,
};
