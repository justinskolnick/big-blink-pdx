const createError = require('http-errors');

const { PARAM_OPTIONS } = require('../config/params');

const paramHelper = require('../helpers/param');

const validateParams = (req, res, next) => {
  Object.keys(PARAM_OPTIONS).forEach((param) => {
    if (req.query.has(param)) {
      if (!paramHelper.isValid(req.query, param)) {
        const value = req.query.get(param);

        req.query.delete(param);

        next(createError(422, paramHelper.getInvalidValueMessage(param, value)));
      }
    }
  });

  next();
};

module.exports = validateParams;
