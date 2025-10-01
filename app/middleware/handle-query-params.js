const { PARAM_OPTIONS } = require('../config/params');

const {
  getDeprecatedParamMessage,
  getInvalidValueMessage,
} = require('../lib/request/messages');
const {
  getParamValue,
  isDeprecated,
  isValid,
} = require('../lib/request/search-params');

const handleQueryParams = (req, res, next) => {
  const searchParams = new Map();

  Object.keys(PARAM_OPTIONS).forEach((param) => {
    if (req.query.has(param)) {
      if (isValid(req.query, param)) {
        if (isDeprecated(req.query, param)) {
          req.flash.setWarning(getDeprecatedParamMessage(param));
        }

        searchParams.set(param, getParamValue(req.query, param));
      } else {
        req.query.delete(param);
        req.flash.setError(getInvalidValueMessage(param, req.query.get(param)));
      }
    }
  });

  req.searchParams = searchParams;

  next();
};

module.exports = handleQueryParams;
