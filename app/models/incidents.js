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
const PER_PAGE = 10;

module.exports = {
  TABLE,
  FIELDS,
  PER_PAGE,
};
