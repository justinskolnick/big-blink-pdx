const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const linkHelper = require('../helpers/links');
const headers = require('../lib/headers');
const { PER_PAGE: INCIDENTS_PER_PAGE } = require('../models/incidents');
const incidents = require('../services/incidents');
const incidentAttendees = require('../services/incident-attendees');
const sources = require('../services/sources');
const stats = require('../services/stats');

const title = 'Data Sources';
const template = 'main';
const view = {
  section: 'sources',
};

router.get('/', async (req, res, next) => {
  if (req.get('Content-Type') === headers.json) {
    let sourcesResult;
    let sourceTotal;
    let data;
    let meta;

    try {
      sourcesResult = await sources.getAll({ includeCount: true });
      sourceTotal = await sources.getTotal();

      data = {
        sources: {
          records: sourcesResult,
          total: sourceTotal,
        }
      };
      meta = { view };

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting sources:', err.message);
      next(createError(err));
    }
  } else {
    res.render(template, { title, robots: headers.robots });
  }
});

router.get('/:id', async (req, res, next) => {
  if (req.get('Content-Type') === headers.json) {
    const id = req.params.id;
    const page = req.query.get('page') || 1;

    const perPage = INCIDENTS_PER_PAGE;
    const links = linkHelper.links;

    let source;
    let incidentsStats;
    let sourceIncidents;
    let records;
    let data;
    let meta;

    try {
      source = await sources.getAtId(id);
      incidentsStats = await stats.getIncidentsStats({ sourceId: id });
      sourceIncidents = await incidents.getAll({ page, perPage, sourceId: id });
      records = await incidentAttendees.getAllForIncidents(sourceIncidents);

      data = {
        source: {
          record: {
            ...source,
            incidents: {
              records,
              pagination: linkHelper.getPagination({
                total: incidentsStats.total,
                perPage,
                page,
                path: links.source(id),
              }),
              ...incidentsStats,
            },
          },
        },
      };
      meta = { id, page, perPage, view };

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting source:', err.message);
      next(createError(err));
    }
  } else {
    res.render(template, { title, robots: headers.robots });
  }
});

module.exports = router;
