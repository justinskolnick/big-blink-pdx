const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const metaHelper = require('../helpers/meta');
const paramHelper = require('../helpers/param');

const headers = require('../lib/headers');

const Entity = require('../models/entity');
const Person = require('../models/person');

const entities = require('../services/entities');
const incidents = require('../services/incidents');
const people = require('../services/people');
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
    let entitiesResult;
    let lobbyistsResult;
    let peopleResult;
    let officialsResult;
    let incidentCountResult;
    let data;

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

      incidentCountResult = await incidents.getTotal();

      data = {
        entities: {
          records: entitiesResult.map(result =>
            Entity.appendIncidentsPercentageIfTotal(result, incidentCountResult)
          ),
          leaderboard: {
            all: {
              labels: {
                title: 'Lobbying Entities',
                subtitle: 'Lobbying entities are ranked by total number of lobbying incident appearances.',
                table: {
                  title: 'Portland’s most active lobbying entities',
                },
                links: {
                  more: 'View the full list of lobbying entities',
                }
              },
              ids: entitiesResult.map(item => item.id),
            },
          }
        },
        people: {
          records: peopleResult.map(result =>
            Person.appendIncidentsPercentageIfTotal(result, incidentCountResult)
          ),
          leaderboard: {
            lobbyists: {
              labels: {
                title: 'Lobbyists',
                subtitle: 'Lobbyists are ranked by total number of lobbying incident appearances.',
                table: {
                  title: 'Portland’s most active lobbyists',
                },
                links: {
                  more: 'View all lobbyists in the full list of people',
                },
              },
              ids: lobbyistsResult.map(item => item.id),
            },
            officials: {
              labels: {
                title: 'City Officials',
                subtitle: 'Portland City officials are ranked by total number of lobbying incident appearances.',
                table: {
                  title: 'Portland’s most lobbied officials',
                },
                links: {
                  more: 'View all officials in the full list of people',
                },
              },
              ids: officialsResult.map(item => item.id),
            },
          }
        },
      };

      res.json({ title, data, meta });
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
      console.error('Error while getting overview:', err.message); // eslint-disable-line no-console
      next(createError(err));
    }
  } else {
    res.redirect('/');
  }
});

module.exports = router;
