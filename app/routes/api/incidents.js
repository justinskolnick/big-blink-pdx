const createError = require('http-errors');
const express = require('express');

const {
  PARAM_DATE_ON,
  PARAM_DATE_RANGE_FROM,
  PARAM_DATE_RANGE_TO,
  PARAM_PAGE,
  PARAM_SORT,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
  SECTION_INCIDENTS,
} = require('../../config/constants');

const linkHelper = require('../../helpers/links');
const metaHelper = require('../../helpers/meta');

const { getFilters } = require('../../lib/incident/filters');
const searchParams = require('../../lib/request/search-params');

const Incident = require('../../models/incident');

const incidents = require('../../services/incidents');
const incidentAttendees = require('../../services/incident-attendees');
const stats = require('../../services/stats');

const title = 'Incidents';
const slug = SECTION_INCIDENTS;
const section = {
  slug,
  title,
};
const view = {
  section: slug,
};

const router = express.Router({
  mergeParams: true,
});

router.get('/', async (req, res, next) => {
  const dateOn = req.searchParams.get(PARAM_DATE_ON);
  const dateRangeFrom = req.searchParams.get(PARAM_DATE_RANGE_FROM);
  const dateRangeTo = req.searchParams.get(PARAM_DATE_RANGE_TO);
  const page = req.searchParams.get(PARAM_PAGE) || 1;
  const sort = req.searchParams.get(PARAM_SORT);

  const perPage = Incident.perPage;
  const links = linkHelper.links;
  const description = metaHelper.getIndexDescription();

  let incidentsResult;
  let incidentCountResult;
  let paginationTotal;
  let records;
  let filters;
  let params;
  let data;
  let meta;

  section.id = null;
  section.subtitle = null;

  try {
    paginationTotal = await stats.getPaginationStats({
      dateOn,
      dateRangeFrom,
      dateRangeTo,
    });
    incidentsResult = await incidents.getAll({
      dateOn,
      dateRangeFrom,
      dateRangeTo,
      page,
      perPage,
      sort,
    });
    incidentsResult = incidentsResult.map(incident => incident.adapted);

    incidentCountResult = await incidents.getTotal();
    records = await incidentAttendees.getAllForIncidents(incidentsResult);

    filters = getFilters(req.query);
    params = searchParams.getParamsFromFilters(req.query, filters);

    data = {
      incidents: {
        records,
        pagination: linkHelper.getPagination({
          page,
          params,
          path: links.incidents(),
          perPage,
          total: paginationTotal,
        }),
        total: incidentCountResult,
      }
    };
    meta = metaHelper.getMeta(req, {
      description,
      page,
      perPage,
      section,
      view,
    });

    res.status(200).json({ title, data, meta });
  } catch (err) {
    console.error('Error while getting incidents:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

router.get('/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  const description = metaHelper.getDetailDescription();

  let incidentResult;
  let record;
  let adapted;
  let attendeesResult;
  let data;
  let meta;

  try {
    incidentResult = await incidents.getAtId(id);
  } catch (err) {
    console.error('Error while getting incident:', err.message); // eslint-disable-line no-console
    return next(createError(err));
  }

  if (incidentResult.exists) {
    adapted = incidentResult.adapted;

    section.id = adapted.id;
    section.subtitle = 'Incident';
  } else {
    return next(createError(404, `No record was found with an ID of ${id}`));
  }

  try {
    attendeesResult = await incidentAttendees.getAll({ incidentId: id });

    const {
      lobbyists,
      officials,
    } = attendeesResult;

    record = incidentResult.adapted;
    record.attendees = {
      lobbyists: {
        records: lobbyists?.map(value => value.adapted) ?? [],
        role: ROLE_LOBBYIST,
      },
      officials: {
        records: officials?.map(value => value.adapted) ?? [],
        role: ROLE_OFFICIAL,
      },
    };

    data = {
      incident: {
        record,
      },
    };
    meta = metaHelper.getMeta(req, {
      description,
      id,
      section,
      view,
    });

    res.status(200).json({ title, data, meta });
  } catch (err) {
    console.error('Error while getting incident:', err.message); // eslint-disable-line no-console
    return next(createError(err));
  }
});

module.exports = router;
