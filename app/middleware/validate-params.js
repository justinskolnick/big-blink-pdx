const createError = require('http-errors');

const paramHelper = require('../helpers/param');

/* eslint-disable camelcase */
const params = {
  date_on: {
    validate: 'hasDate',
  },
  page: {
    validate: 'hasInteger',
  },
  quarter: {
    validate: 'hasQuarterAndYear',
  },
  sort: {
    validate: 'hasSort',
  },
  sort_by: {
    validate: 'hasSortBy',
  },
  with_entity_id: {
    validate: 'hasInteger',
  },
  with_person_id: {
    validate: 'hasInteger',
  },
};
/* eslint-enable camelcase */

const validateParams = (req, res, next) => {
  Object.entries(params).forEach(([param, definition]) => {
    if (req.query.has(param)) {
      const value = req.query.get(param);

      if (definition.validate in paramHelper) {
        if (!paramHelper[definition.validate](value)) {
          req.query.delete(param);
          next(createError(422, paramHelper.getInvalidValueMessage(param, value)));
        }
      }
    }
  });

  next();
};

module.exports = validateParams;
