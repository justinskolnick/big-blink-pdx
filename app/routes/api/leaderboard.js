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

const callback = (item, incidentCountResult) => {
  item.setGlobalIncidentCount(incidentCountResult);
  item.setOverview();

  return item.adapted;
};

const setOptions = async (req, res, next) => {
  const quarter = req.searchParams.get(PARAM_QUARTER_ALT);

  const options = {
    page: 1,
    perPage: 5,
    includeTotal: true,
    sortBy: SORT_BY_TOTAL,
  };
  const incidentCountOptions = {};
  const totalOptions = {};

  let period = '2014–25';
  let periodIsValid = false;

  try {
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
  } catch (err) {
    console.error('Error while getting leaderboard options:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }

  res.locals = {
    incidentCountOptions,
    options,
    period,
    periodIsValid,
    totalOptions,
  };

  next();
};

router.get('/', setOptions, async (req, res, next) => {
  const {
    incidentCountOptions,
    period,
    periodIsValid,
    totalOptions,
  } = res.locals;

  let incidentCountResult;
  let data;
  let filters;
  let meta;

  try {
    incidentCountResult = await incidents.getTotal(incidentCountOptions);

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
        values: {},
      },
    };
    meta = metaHelper.getMeta(req);

    res.status(200).json({ data, meta });
  } catch (err) {
    console.error('Error while getting leaderboard:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

router.get('/entities', setOptions, async (req, res, next) => {
  const {
    options,
    incidentCountOptions,
  } = res.locals;

  let incidentCountResult;
  let data;
  let meta;

  try {
    incidentCountResult = await incidents.getTotal(incidentCountOptions);

    const results = await entities.getAll(options);
    const entitiesResult = results.map(result => callback(result, incidentCountResult));

    data = {
      leaderboard: {
        values: {
          entities: Leaderboard.getValuesForEntities(entitiesResult, incidentCountResult),
        },
      },
      entities: {
        records: entitiesResult,
      },
    };
    meta = metaHelper.getMeta(req);

    res.status(200).json({ data, meta });
  } catch (err) {
    console.error('Error while getting leaderboard:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

router.get('/lobbyists', setOptions, async (req, res, next) => {
  const {
    options,
    incidentCountOptions,
  } = res.locals;

  let incidentCountResult;
  let data;
  let meta;

  try {
    incidentCountResult = await incidents.getTotal(incidentCountOptions);

    const results = await people.getAll({
      ...options,
      role: ROLE_LOBBYIST,
    });
    const lobbyistsResults = results.map(result => callback(result, incidentCountResult));

    data = {
      leaderboard: {
        values: {
          lobbyists: Leaderboard.getValuesForLobbyists(lobbyistsResults, incidentCountResult),
        },
      },
      people: {
        records: lobbyistsResults,
      },
    };
    meta = metaHelper.getMeta(req);

    res.status(200).json({ data, meta });
  } catch (err) {
    console.error('Error while getting leaderboard lobbyists:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

router.get('/officials', setOptions, async (req, res, next) => {
  const {
    options,
    incidentCountOptions,
  } = res.locals;

  let incidentCountResult;
  let data;
  let meta;

  try {
    incidentCountResult = await incidents.getTotal(incidentCountOptions);

    const results = await people.getAll({
      ...options,
      role: ROLE_OFFICIAL,
    });
    const officialsResults = results.map(result => callback(result, incidentCountResult));

    data = {
      leaderboard: {
        values: {
          officials: Leaderboard.getValuesForOfficials(officialsResults, incidentCountResult),
        },
      },
      people: {
        records: officialsResults,
      },
    };
    meta = metaHelper.getMeta(req);

    res.status(200).json({ data, meta });
  } catch (err) {
    console.error('Error while getting leaderboard officials:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

module.exports = router;
