const createError = require('http-errors');

const { PARAM_OPTIONS } = require('../config/params');

const { getInvalidValueMessage } = require('../lib/request/messages');
const { isValid } = require('../lib/request/search-params');

const validateParams = (req, res, next) => {
  Object.keys(PARAM_OPTIONS).forEach((param) => {
    if (req.query.has(param)) {
      if (!isValid(req.query, param)) {
        const value = req.query.get(param);

        req.query.delete(param);

        next(createError(422, getInvalidValueMessage(param, value)));
      }
    }
  });

  next();
};

module.exports = validateParams;
