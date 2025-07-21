const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const {
  PARAM_QUARTER_ALT,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
  SORT_BY_TOTAL,
} = require('../config/constants');

const filterHelper = require('../helpers/filter');
const metaHelper = require('../helpers/meta');
const paramHelper = require('../helpers/param');

const headers = require('../lib/headers');

const Leaderboard = require('../models/leaderboard/leaderboard');

const entities = require('../services/entities');
const incidents = require('../services/incidents');
const people = require('../services/people');
const quarters = require('../services/quarters');
const sources = require('../services/sources');

const title = 'Remixing lobbying data published by the City of Portland, Oregon';
const template = 'main';
const section = {};

router.get('/', async (req, res, next) => {
  const description = metaHelper.getIndexDescription();
  const meta = {
    description,
    pageTitle: title,
    section,
  };

  if (req.get('Content-Type') === headers.json) {
    let data;

    try {
      const results = await Promise.all([
        incidents.getTotal(),
        incidents.getFirstAndLastDates(),
      ]);
      const [total, firstAndLast] = results;

      data = {
        incidents: {
          first: firstAndLast.first,
          last: firstAndLast.last,
          total,
        },
      };

      res.status(200).json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting people:', err.message); // eslint-disable-line no-console
      next(createError(err));
    }
  } else {
    res.render(template, { title, meta, robots: headers.robots });
  }
});

router.get('/overview', async (req, res, next) => {
  if (req.get('Content-Type') === headers.json) {
    let stats;
    let data;

    try {
      stats = await sources.getStats();

      data = {
        stats: {
          sources: stats,
        },
      };

      res.status(200).json({ data });
    } catch (err) {
      console.error('Error while getting overview:', err.message); // eslint-disable-line no-console
      next(createError(err));
    }
  } else {
    res.redirect('/');
  }
});

router.get('/leaderboard', async (req, res, next) => {
  const quarter = req.query.get(PARAM_QUARTER_ALT);

  const errors = [];
  const warnings = [];

  if (req.get('Content-Type') === headers.json) {
    let incidentCountResult;
    let data;
    let dateRangeFrom;
    let dateRangeTo;
    let filters;
    let periodIsValid = false;
    let meta;
    let period = '2014–25';

    try {
      const incidentCountOptions = {};
      const options = {
        page: 1,
        perPage: 5,
        includeCount: true,
        sortBy: SORT_BY_TOTAL,
      };
      const totalOptions = {};

      if (paramHelper.hasYearAndQuarter(quarter)) {
        const quarterOptions = paramHelper.getQuarterAndYear(quarter);
        const quarterResult = await quarters.getQuarter(quarterOptions);

        periodIsValid = quarterResult.hasData();

        if (periodIsValid) {
          dateRangeFrom = quarterResult.getData('date_start');
          dateRangeTo = quarterResult.getData('date_end');

          if (dateRangeFrom && dateRangeTo) {
            [options, incidentCountOptions, totalOptions].forEach(optionSet => {
              optionSet.dateRangeFrom = dateRangeFrom;
              optionSet.dateRangeTo = dateRangeTo;
            });

            period = quarterResult.readablePeriod;
          }
        } else {
          warnings.push({
            message: paramHelper.getOutOfRangeValueMessage(PARAM_QUARTER_ALT, quarter),
          });
        }
      }

      incidentCountResult = await incidents.getTotal(incidentCountOptions);

      const callback = (item) => {
        item.setGlobalIncidentCount(incidentCountResult);
        item.setOverview();

        return item.adapted;
      };

      const results = await Promise.all([
        entities.getAll(options),
        people.getAll({
          ...options,
          role: ROLE_LOBBYIST,
        }),
        people.getAll({
          ...options,
          role: ROLE_OFFICIAL,
        }),
      ]);
      const [
        entitiesResult,
        lobbyistsResult,
        officialsResult,
      ] = results.map(result => result.map(callback));

      const totalResults = await Promise.all([
        entities.getTotal(totalOptions),
        people.getTotal({
          ...totalOptions,
          role: ROLE_LOBBYIST,
        }),
        people.getTotal({
          ...totalOptions,
          role: ROLE_OFFICIAL,
        }),
      ]);
      const [
        entitiesTotalResult,
        lobbyistsTotalResult,
        officialsTotalResult,
      ] = totalResults;

      const descriptionValues = {
        entitiesTotalResult,
        incidentCountResult,
        lobbyistsTotalResult,
        officialsTotalResult,
        period,
        periodIsValid,
      };

      filters = filterHelper.getLeaderboardFilters(req.query);

      data = {
        leaderboard: {
          labels: Leaderboard.getSectionLabels(descriptionValues),
          filters,
          values: {
            entities: Leaderboard.getValuesForEntities(entitiesResult, incidentCountResult),
            lobbyists: Leaderboard.getValuesForLobbyists(lobbyistsResult, incidentCountResult),
            officials: Leaderboard.getValuesForOfficials(officialsResult, incidentCountResult),
          },
        },
        entities: {
          records: entitiesResult,
        },
        people: {
          records: [].concat(lobbyistsResult, officialsResult),
        },
      };
      meta = {
        errors,
        warnings,
      };

      res.status(200).json({ data, meta });
    } catch (err) {
      console.error('Error while getting people:', err.message); // eslint-disable-line no-console
      next(createError(err));
    }
  } else {
    res.redirect('/');
  }
});

module.exports = router;
