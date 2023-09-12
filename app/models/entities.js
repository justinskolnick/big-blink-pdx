const TABLE = 'entities';
const FIELDS = [
  'id',
  'name',
  'domain',
];
const PER_PAGE = 40;

const adaptResult = (result) => {
  const adapted = {
    id: result.id,
    name: result.name,
  };

  if (result.total) {
    adapted.incidents = {
      total: result.total,
    };
  }

  return adapted;
};

module.exports = {
  TABLE,
  FIELDS,
  PER_PAGE,
  adaptResult,
};
