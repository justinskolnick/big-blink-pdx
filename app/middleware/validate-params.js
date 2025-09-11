const createError = require('http-errors');

const { PARAM_OPTIONS } = require('../config/params');

const paramHelper = require('../helpers/param');

const validateParams = (req, res, next) => {
  Object.entries(PARAM_OPTIONS).forEach(([param, definition]) => {
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
