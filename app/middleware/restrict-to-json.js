const headers = require('../lib/headers');

const restrictToJson = (req, res, next) => {
  if (req.get('Content-Type') === headers.json) {
    next();
  } else {
    res.redirect('/');
  }
};

module.exports = restrictToJson;
