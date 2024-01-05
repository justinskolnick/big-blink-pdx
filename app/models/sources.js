const dateHelper = require('../helpers/date');

const TABLE = 'data_sources';
const FIELDS = [
  'id',
  'type',
  'format',
  'title',
  'year',
  'quarter',
  'public_url',
  'retrieved_at',
];

const ACTIVITY_TYPE = 'activity';
const REGISTRATION_TYPE = 'registration';

const adaptRetrievedDate = str => dateHelper.formatDateString(str);

const adaptResult = (result) => {
  const adapted = {
    id: result.id,
    type: result.type,
    format: result.format,
    title: result.title,
    year: result.year,
    quarter: result.quarter,
    publicUrl: result.public_url,
    retrievedDate: adaptRetrievedDate(result.retrieved_at),
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

const adaptEntitiesResult = (result) => {
  const adapted = {
    entity: {
      id: result.id,
      name: result.name,
    },
  };

  if (result.total) {
    adapted.total = result.total;
  }

  return adapted;
};

module.exports = {
  TABLE,
  FIELDS,
  ACTIVITY_TYPE,
  REGISTRATION_TYPE,
  adaptEntitiesResult,
  adaptResult,
};
