const OfficialPosition = require('../models/official-position');
const { getAtPernrQuery } = require('./queries/official-positions');

const db = require('./db');

const appendSupervisor = async (record) => {
  if (record.isSubordinate) {
    const supervisor = await getAtPernr(record.responsibleToPernr, record.startDate);

    if (supervisor) {
      record.setSupervisor(supervisor.asSupervisor);
    }
  } else {
    await undefined;
  }

  return record;
};

const getAtPernr = async (pernr, dateOn = null) => {
  const { clauses, params } = getAtPernrQuery(pernr, dateOn);
  const result = await db.get(clauses, params);

  return new OfficialPosition(result);
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
