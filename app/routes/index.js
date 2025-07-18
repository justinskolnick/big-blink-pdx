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
    const descriptionClauses = [];
    let incidentCountResult;
    let data;
    let dateRangeFrom;
    let dateRangeTo;
    let description;
    let filters;
    let hasValidPeriod = false;
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

        hasValidPeriod = quarterResult.hasData();

        if (hasValidPeriod) {
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

      if (hasValidPeriod) {
        descriptionClauses.push(`In ${period}`);
      } else {
        descriptionClauses.push('Since 2014');
      }

      descriptionClauses.push(`${lobbyistsTotalResult} lobbyists representing ${entitiesTotalResult} entities reported lobbying ${officialsTotalResult} City of Portland officials across ${incidentCountResult} reported incidents.`);

      description = descriptionClauses.join(', ');

      filters = filterHelper.getLeaderboardFilters(req.query);

      data = {
        leaderboard: {
          labels: {
            title: 'Leaderboard',
            period,
            description,
            filters: {
              intro: 'Showing activity',
            }
          },
          filters,
          values: {
            entities: {
              ids: entitiesResult.map(item => item.id),
              labels: {
                title: 'Lobbying Entities',
                subtitle: 'Lobbying entities are ranked by total number of lobbying incident appearances.',
                table: {
                  title: 'Portland’s most active lobbying entities',
                  column: {
                    name: 'Name of the lobbying entity',
                    total: 'Total number of lobbying incidents reported for this entity',
                    percentage: `Share of ${incidentCountResult} incidents`,
                  },
                },
                links: {
                  more: 'View the full list of lobbying entities',
                }
              },
            },
            lobbyists: {
              ids: lobbyistsResult.map(item => item.id),
              labels: {
                title: 'Lobbyists',
                subtitle: 'Lobbyists are ranked by total number of lobbying incident appearances.',
                table: {
                  title: 'Portland’s most active lobbyists',
                  column: {
                    name: 'Name of the lobbyist',
                    total: 'Total number of lobbying incidents reported for this lobbyist',
                    percentage: `Share of ${incidentCountResult} incidents`,
                  },
                },
                links: {
                  more: 'View all lobbyists in the full list of people',
                },
              },
            },
            officials: {
              ids: officialsResult.map(item => item.id),
              labels: {
                title: 'City Officials',
                subtitle: 'Portland City officials are ranked by total number of lobbying incident appearances.',
                table: {
                  title: 'Portland’s most lobbied officials',
                  column: {
                    name: 'Name of the lobbied official',
                    total: 'Total number of lobbying incidents reported for this official',
                    percentage: `Share of ${incidentCountResult} incidents`,
                  },
                },
                links: {
                  more: 'View all officials in the full list of people',
                },
              },
            },
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
