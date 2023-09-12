const TABLE = 'entity_lobbyist_locations';
const FIELDS = [
  'id',
  // 'data_source_id',
  'entity_id',
  'city',
  'region',
];

const adaptResult = result => ({
  id: result.id,
  city: result.city,
  region: result.region,
});

module.exports = {
  TABLE,
  FIELDS,
  adaptResult,
};
