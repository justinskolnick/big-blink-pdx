require('dotenv').config({
  path: `${__dirname}/../.env`,
  quiet: true,
});

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');

const headers = require('./lib/headers');

const validateParams = require('./middleware/validate-params');

const indexRouter = require('./routes/index');
const entitiesRouter = require('./routes/entities');
const incidentsRouter = require('./routes/incidents');
const peopleRouter = require('./routes/people');
const sourcesRouter = require('./routes/sources');

const app = express();


const errorCodes = {
  404: 'Not Found',
  422: 'Unprocessable Content',
  500: 'Internal Server Error',
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('query parser', (queryString) => new URLSearchParams(queryString));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (req, res, next) => {
  res.set('X-Robots-Tag', headers.robots);

  if (req.get('Content-Type') === headers.json) {
    res.type(headers.json);
  } else {
    res.type(headers.html);
  }

  next();
});

app.use('/', validateParams);

app.use('/', indexRouter);
app.use('/entities', entitiesRouter);
app.use('/incidents', incidentsRouter);
app.use('/people', peopleRouter);
app.use('/sources', sourcesRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => { // eslint-disable-line @typescript-eslint/no-unused-vars
  const isDevelopment = req.app.get('env') === 'development';
  const error = {};

  if (err.status && err.status in errorCodes) {
    error.customMessage = err.message;
    error.message = errorCodes[err.status];
    error.stack = err.stack;
    error.status = err.status;
  }

  res.locals.isDevelopment = isDevelopment;
  res.locals.error = error;

  if (req.get('Content-Type') === headers.json) {
    res.status(200).json({ meta: { errors: [error] } });
  } else {
    res.status(err.status || 500);
    res.render('error', { robots: headers.robots });
  }
});

module.exports = app;
