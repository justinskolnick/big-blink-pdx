require('dotenv').config({ path: `${__dirname}/../.env` });

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');

const paramHelper = require('./helpers/param');

const headers = require('./lib/headers');

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

app.use('/', (req, res, next) => {
  ['page', 'with_entity_id', 'with_person_id'].forEach(param => {
    if (req.query.has(param)) {
      const value = req.query.get(param);

      if (isNaN(value)) {
        req.query.delete(param);
        next(createError(422, paramHelper.getInvalidValueMessage(param, value)));
      }
    }
  });

  if (req.query.has('quarter')) {
    const value = req.query.get('quarter');

    if (!paramHelper.hasQuarterAndYear(value)) {
      req.query.delete('quarter');
      next(createError(422, paramHelper.getInvalidValueMessage('quarter', value)));
    }
  }

  if (req.query.has('sort')) {
    const value = req.query.get('sort');

    if (!paramHelper.hasSort(value)) {
      req.query.delete('sort');
      next(createError(422, paramHelper.getInvalidValueMessage('sort', value)));
    }
  }

  if (req.query.has('sort_by')) {
    const value = req.query.get('sort_by');

    if (!paramHelper.hasSortBy(value)) {
      req.query.delete('sort_by');
      next(createError(422, paramHelper.getInvalidValueMessage('sort_by', value)));
    }
  }

  next();
});

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
app.use((err, req, res) => {
  const isDevelopment = req.app.get('env') === 'development';
  const error = {};

  if (err.status && err.status in errorCodes) {
    error.customMessage = err.message;
    error.message = errorCodes[err.status];
    error.status = err.status;
  }

  res.locals.isDevelopment = isDevelopment;
  res.locals.error = error;

  if (req.get('Content-Type') === headers.json) {
    res.json({ meta: { errors: [error] } });
  } else {
    res.status(err.status || 500);
    res.render('error', { robots: headers.robots });
  }
});

module.exports = app;
