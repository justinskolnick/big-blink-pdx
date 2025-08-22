const OfficialPosition = require('../models/official-position');
const { getAtPernrQuery } = require('./queries/official-positions');

const db = require('./db');

const now = (new Date()).toISOString();

const appendSupervisor = async (record) => {
  if (record.isSubordinate) {
    const pernr = record.responsibleToPernr;
    const options = {
      dateOn: record.dateStart,
    };

    if (record.isAssumedCurrent) {
      options.dateOn = now;
    }

    const supervisor = await getAtPernr(pernr, options);

    if (supervisor) {
      record.setSupervisor(supervisor.asSupervisor);
    }
  } else {
    await undefined;
  }

  return record;
};

const getAtPernr = async (pernr, options = {}) => {
  const { clauses, params } = getAtPernrQuery(pernr, options);
  const result = await db.get(clauses, params);

  if (result) {
    return new OfficialPosition(result);
  }

  return null;
};

const getAllAtPernr = async (pernr) => {
  const { clauses, params } = getAtPernrQuery(pernr);
  const results = await db.getAll(clauses, params);
  const records = results.map(result => new OfficialPosition(result));

  return Promise.all(records.map(async (record) => {
    const fullRecord = await appendSupervisor(record);

    return fullRecord;
  }));
};

module.exports = {
  getAllAtPernr,
};
