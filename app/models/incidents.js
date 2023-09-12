const dateHelper = require('../helpers/date');

const TABLE = 'incidents';
const FIELDS = [
  'id',
  'entity',
  'entity_id',
  'contact_date',
  'contact_type',
  'category',
  'data_source_id',
  'topic',
  'officials',
  'lobbyists',
  'notes',
];
const PER_PAGE = 15;

const adaptContactDate = str => dateHelper.formatDateString(str);

const adaptResult = (result) => ({
  id: result.id,
  entity: result.entity,
  entityId: result.entity_id,
  entityName: result.entity_name,
  contactDate: adaptContactDate(result.contact_date),
  contactType: result.contact_type,
  category: result.category,
  sourceId: result.data_source_id,
  topic: result.topic,
  officials: result.officials,
  lobbyists: result.lobbyists,
  notes: result.notes,
  raw: {
    officials: result.officials,
    lobbyists: result.lobbyists,
  },
});

module.exports = {
  TABLE,
  FIELDS,
  PER_PAGE,
  adaptResult,
};
