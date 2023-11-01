const TABLE = 'people';
const FIELDS = [
  'id',
  'type',
  'name',
];
const PER_PAGE = 40;

const adaptResult = (result) => {
  const adapted = {
    id: result.id,
    type: result.type,
    name: result.name,
    roles: result.roles?.split(',') ?? [],
  };

  if (result.total) {
    adapted.incidents = {
      stats: {
        total: result.total,
      },
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
