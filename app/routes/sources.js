const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const linkHelper = require('../helpers/links');
const metaHelper = require('../helpers/meta');
const paramHelper = require('../helpers/param');
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
  const description = metaHelper.getIndexDescription();
  let sourcesResult;
  let sourceTotal;
  let data;
  let meta;

  if (req.get('Content-Type') === headers.json) {
    try {
      sourcesResult = await sources.getAll({ includeCount: true });
      sourceTotal = await sources.getTotal();

      data = {
        sources: {
          records: sourcesResult,
          total: sourceTotal,
        }
      };
      meta = { description, view };

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting sources:', err.message); // eslint-disable-line no-console
      next(createError(err));
    }
  } else {
    meta = { description };

    res.render(template, { title, meta, robots: headers.robots });
  }
});

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  const page = req.query.get('page') || 1;
  const sort = req.query.get('sort');

  const params = {};
  const perPage = INCIDENTS_PER_PAGE;
  const links = linkHelper.links;

  let source;
  let description = metaHelper.getDetailDescription();
  let incidentsStats;
  let sourceIncidents;
  let records;
  let data;
  let meta;

  try {
    source = await sources.getAtId(id);
    description = metaHelper.getDetailDescription(source.title, 'from');
  } catch (err) {
    console.error('Error while getting person:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }

  if (req.get('Content-Type') === headers.json) {
    try {
      incidentsStats = await stats.getIncidentsStats({ sourceId: id });
      sourceIncidents = await incidents.getAll({
        page,
        perPage,
        sourceId: id,
        sort,
      });
      records = await incidentAttendees.getAllForIncidents(sourceIncidents);

      if (paramHelper.hasSort(sort)) {
        params.sort = paramHelper.getSort(sort);
      }

      data = {
        source: {
          record: {
            ...source,
            incidents: {
              records,
              filters: params,
              pagination: linkHelper.getPagination({
                page,
                params,
                path: links.source(id),
                perPage,
                total: incidentsStats.total,
              }),
              ...incidentsStats,
            },
          },
        },
      };
      meta = {
        description,
        id,
        page,
        perPage,
        view,
      };

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting source:', err.message); // eslint-disable-line no-console
      next(createError(err));
    }
  } else {
    meta = { description };

    res.render(template, { title, meta, robots: headers.robots });
  }
});

module.exports = router;
