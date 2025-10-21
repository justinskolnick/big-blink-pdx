const createError = require('http-errors');
const express = require('express');

const {
  PARAM_QUARTER_ALT,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
  SORT_BY_TOTAL,
} = require('../../config/constants');

const metaHelper = require('../../helpers/meta');

const { getLeaderboardFilters } = require('../../lib/incident/filters');
const { getOutOfRangeValueMessage } = require('../../lib/request/messages');
const searchParams = require('../../lib/request/search-params');

const Leaderboard = require('../../models/leaderboard/leaderboard');

const entities = require('../../services/entities');
const incidents = require('../../services/incidents');
const people = require('../../services/people');
const quarters = require('../../services/quarters');

const router = express.Router({
  mergeParams: true,
});

router.get('/', async (req, res, next) => {
  const quarter = req.searchParams.get(PARAM_QUARTER_ALT);

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
      includeTotal: true,
      sortBy: SORT_BY_TOTAL,
    };
    const totalOptions = {};

    if (searchParams.hasYearAndQuarter(quarter)) {
      const quarterOptions = searchParams.getQuarterAndYear(quarter);
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
        req.flash.setWarning(getOutOfRangeValueMessage(PARAM_QUARTER_ALT, quarter));
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

    filters = getLeaderboardFilters(req.query);

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
    meta = metaHelper.getMeta(req);

    res.status(200).json({ data, meta });
  } catch (err) {
    console.error('Error while getting leaderboard:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

module.exports = router;
