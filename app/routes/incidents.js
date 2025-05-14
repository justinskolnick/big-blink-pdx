const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const {
  PARAM_DATE_ON,
  PARAM_DATE_RANGE_FROM,
  PARAM_DATE_RANGE_TO,
  PARAM_PAGE,
  PARAM_SORT,
  SECTION_INCIDENTS,
} = require('../config/constants');

const filterHelper = require('../helpers/filter');
const linkHelper = require('../helpers/links');
const metaHelper = require('../helpers/meta');
const paramHelper = require('../helpers/param');

const headers = require('../lib/headers');

const Incident = require('../models/incident');

const incidents = require('../services/incidents');
const incidentAttendees = require('../services/incident-attendees');
const stats = require('../services/stats');

const title = 'Incidents';
const template = 'main';
const slug = SECTION_INCIDENTS;
const section = {
  slug,
  title,
};
const view = {
  section: slug,
};

router.get('/', async (req, res, next) => {
  const dateOn = req.query.get(PARAM_DATE_ON);
  const dateRangeFrom = req.query.get(PARAM_DATE_RANGE_FROM);
  const dateRangeTo = req.query.get(PARAM_DATE_RANGE_TO);
  const page = req.query.get(PARAM_PAGE) || 1;
  const sort = req.query.get(PARAM_SORT);

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

  if (req.get('Content-Type') === headers.json) {
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

      filters = filterHelper.getFilters(req.query);
      params = paramHelper.getParamsFromFilters(req.query, filters);

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
      meta = {
        description,
        page,
        pageTitle: metaHelper.getPageTitle(section),
        perPage,
        section,
        view,
      };

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting incidents:', err.message); // eslint-disable-line no-console
      next(createError(err));
    }
  } else {
    meta = { description };

    res.render(template, { title, meta, robots: headers.robots });
  }
});

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;
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

  if (req.get('Content-Type') === headers.json) {
    try {
      attendeesResult = await incidentAttendees.getAll({ incidentId: id });

      record = incidentResult.adapted;
      record.attendees = {
        lobbyists: {
          records: attendeesResult.lobbyists,
        },
        officials: {
          records: attendeesResult.officials,
        },
      };

      data = {
        incident: {
          record,
        },
      };
      meta = {
        description,
        id,
        pageTitle: metaHelper.getPageTitle(section),
        section,
        view,
      };

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting incident:', err.message); // eslint-disable-line no-console
      return next(createError(err));
    }
  } else {
    meta = { description };

    res.render(template, { title, meta, robots: headers.robots });
  }
});

module.exports = router;
