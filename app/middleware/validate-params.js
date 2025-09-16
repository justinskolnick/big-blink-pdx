const { PARAM_OPTIONS } = require('../config/params');

const {
  getDeprecatedParamMessage,
  getInvalidValueMessage,
} = require('../lib/request/messages');
const {
  isDeprecated,
  isValid,
} = require('../lib/request/search-params');

const validateParams = (req, res, next) => {
  Object.keys(PARAM_OPTIONS).forEach((param) => {
    if (req.query.has(param)) {
      if (!isValid(req.query, param)) {
        const value = req.query.get(param);

        req.query.delete(param);
        req.flash.setError(getInvalidValueMessage(param, value));
      } else if (isDeprecated(req.query, param)) {
        req.flash.setWarning(getDeprecatedParamMessage(param));
      }
    }
  });

  next();
};

module.exports = validateParams;
