const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const linkHelper = require('../helpers/links');
const paramHelper = require('../helpers/param');
const headers = require('../lib/headers');
const { PER_PAGE } = require('../models/incidents');
const incidents = require('../services/incidents');
const incidentAttendees = require('../services/incident-attendees');

const title = 'Incidents';
const template = 'main';
const view = {
  section: 'incidents',
};

router.get('/', async (req, res, next) => {
  if (req.get('Content-Type') === headers.json) {
    const page = req.query.get('page') || 1;
    const sort = req.query.get('sort');

    const params = {};
    const perPage = PER_PAGE;
    const links = linkHelper.links;

    let incidentsResult;
    let incidentCountResult;
    let records;
    let data;
    let meta;

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
      meta = { page, perPage, view };

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting incidents:', err.message);
      next(createError(err));
    }
  } else {
    res.render(template, { title, robots: headers.robots });
  }
});

router.get('/:id', async (req, res, next) => {
  if (req.get('Content-Type') === headers.json) {
    const id = req.params.id;

    let incidentResult;
    let attendeesResult;
    let data;
    let meta;

    try {
      incidentResult = await incidents.getAtId(id);
      attendeesResult = await incidentAttendees.getAll({ incidentId: id });

      data = {
        incident: {
          record: {
            ...incidentResult,
            attendees: attendeesResult,
          },
        },
      };
      meta = { id, view };

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting incident:', err.message);
      next(createError(err));
    }
  } else {
    res.render(template, { title, robots: headers.robots });
  }
});

module.exports = router;
