const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const linkHelper = require('../helpers/links');
const metaHelper = require('../helpers/meta');
const paramHelper = require('../helpers/param');
const headers = require('../lib/headers');
const Incident = require('../models/incident');
const incidents = require('../services/incidents');
const incidentAttendees = require('../services/incident-attendees');

const title = 'Incidents';
const template = 'main';
const slug = 'incidents';
const section = {
  slug,
  title,
};
const view = {
  section: slug,
};

router.get('/', async (req, res, next) => {
  const page = req.query.get('page') || 1;
  const sort = req.query.get('sort');

  const params = {};
  const perPage = Incident.perPage;
  const links = linkHelper.links;
  const description = metaHelper.getIndexDescription();

  let incidentsResult;
  let incidentCountResult;
  let records;
  let data;
  let meta;

  section.id = null;
  section.subtitle = null;

  if (req.get('Content-Type') === headers.json) {
    try {
      incidentsResult = await incidents.getAll({ page, perPage, sort });
      incidentCountResult = await incidents.getTotal();
      records = await incidentAttendees.getAllForIncidents(incidentsResult);

      if (paramHelper.hasSort(sort)) {
        params.sort = paramHelper.getSort(sort);
      }

      data = {
        incidents: {
          records,
          pagination: linkHelper.getPagination({
            total: incidentCountResult,
            perPage,
            page,
            params,
            path: links.incidents(),
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
  let attendeesResult;
  let data;
  let meta;

  if (req.get('Content-Type') === headers.json) {
    try {
      incidentResult = await incidents.getAtId(id);
      attendeesResult = await incidentAttendees.getAll({ incidentId: id });

      section.id = incidentResult.id;
      section.subtitle = 'Incident';

      data = {
        incident: {
          record: {
            ...incidentResult,
            attendees: {
              lobbyists: {
                records: attendeesResult.lobbyists,
              },
              officials: {
                records: attendeesResult.officials,
              },
            },
          },
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
      next(createError(err));
    }
  } else {
    meta = { description };

    res.render(template, { title, meta, robots: headers.robots });
  }
});

module.exports = router;
