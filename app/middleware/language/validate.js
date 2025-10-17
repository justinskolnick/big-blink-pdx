const createError = require('http-errors');
const accepts = require('accepts');

const { LANG_EN } = require('../../config/constants');

const validate = (req, res, next) => {
  const lang = LANG_EN;

  if (accepts(req).language(lang)) {
    next();
  } else {
    next(createError(406, `Language "${lang}" is not supported`));
  }
};

module.exports = validate;
