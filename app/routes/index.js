const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const paramHelper = require('../helpers/param');

const headers = require('../lib/headers');
const entities = require('../services/entities');
const incidents = require('../services/incidents');
const people = require('../services/people');
const sources = require('../services/sources');

const title = 'Remixing public lobbying data published by the City of Portland, Oregon';
const template = 'main';

router.get('/', async (req, res, next) => {
  if (req.get('Content-Type') === headers.json) {
    let entitiesResult;
    let lobbyistsResult;
    let peopleResult;
    let officialsResult;
    let data;
    let meta;

    try {
      entitiesResult = await entities.getAll({
        page: 1,
        perPage: 5,
        includeCount: true,
        sortBy: paramHelper.SORT_BY_TOTAL,
      });

      lobbyistsResult = await people.getAll({
        page: 1,
        perPage: 5,
        includeCount: true,
        role: 'lobbyist',
        sortBy: paramHelper.SORT_BY_TOTAL,
      });

      officialsResult = await people.getAll({
        page: 1,
        perPage: 5,
        includeCount: true,
        role: 'official',
        sortBy: paramHelper.SORT_BY_TOTAL,
      });

      peopleResult = [].concat(lobbyistsResult, officialsResult);

      data = {
        entities: {
          records: entitiesResult,
          leaderboard: {
            all: entitiesResult.map(item => item.id),
          }
        },
        people: {
          records: peopleResult,
          leaderboard: {
            lobbyists: lobbyistsResult.map(item => item.id),
            officials: officialsResult.map(item => item.id),
          }
        },
      };
      meta = {};

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting people:', err.message);
      next(createError(err));
    }
  } else {
    res.render(template, { title, robots: headers.robots });
  }
});

router.get('/overview', async (req, res, next) => {
  if (req.get('Content-Type') === headers.json) {
    let incidentCountResult;
    let incidentFirstAndLastResult;
    let stats;
    let data;

    try {
      incidentCountResult = await incidents.getTotal();
      incidentFirstAndLastResult = await incidents.getFirstAndLastDates();
      stats = await sources.getStats();

      data = {
        incidents: {
          first: incidentFirstAndLastResult.first,
          last: incidentFirstAndLastResult.last,
          total: incidentCountResult,
        },
        stats: {
          sources: stats,
        },
      };

      res.json({ data });
    } catch (err) {
      console.error('Error while getting overview:', err.message);
      next(createError(err));
    }
  } else {
    res.redirect('/');
  }
});

module.exports = router;
