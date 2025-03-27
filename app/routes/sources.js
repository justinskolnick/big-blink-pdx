const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const {
  PARAM_DATE_ON,
  PARAM_DATE_RANGE_FROM,
  PARAM_DATE_RANGE_TO,
  PARAM_PAGE,
  PARAM_SORT,
  PARAM_WITH_ENTITY_ID,
  PARAM_WITH_PERSON_ID,
} = require('../config/constants');

const linkHelper = require('../helpers/links');
const metaHelper = require('../helpers/meta');
const paramHelper = require('../helpers/param');

const headers = require('../lib/headers');

const Incident = require('../models/incident');
const Source = require('../models/source');

const incidents = require('../services/incidents');
const incidentAttendees = require('../services/incident-attendees');
const sources = require('../services/sources');
const stats = require('../services/stats');

const title = 'Data Sources';
const template = 'main';
const slug = 'sources';
const section = {
  slug,
  title,
};
const view = {
  section: slug,
};

router.get('/', async (req, res, next) => {
  const description = metaHelper.getIndexDescription();
  let activitySourcesResult;
  let registrationSourcesResult;
  let sourceTotal;
  let data;
  let meta;

  section.id = null;
  section.subtitle = null;

  if (req.get('Content-Type') === headers.json) {
    try {
      activitySourcesResult = await sources.getAll({
        includeCount: true,
        types: [Source.types.activity],
      });
      activitySourcesResult = activitySourcesResult.map(source => {
        source.setOverview();

        return source.adapted;
      });

      registrationSourcesResult = await sources.getAll({
        types: [Source.types.registration],
      });
      registrationSourcesResult = registrationSourcesResult.map(source => source.adapted);

      sourceTotal = await sources.getTotal({
        types: [Source.types.activity, Source.types.registration],
      });

      data = {
        sources: {
          records: [].concat(activitySourcesResult, registrationSourcesResult),
          total: sourceTotal,
        }
      };
      meta = {
        description,
        pageTitle: metaHelper.getPageTitle(section),
        section,
        view,
      };

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting sources:', err.message); // eslint-disable-line no-console
      next(createError(err));
    }
  } else {
    meta = {
      description,
      pageTitle: metaHelper.getPageTitle(section),
    };

    res.render(template, { title, meta, robots: headers.robots });
  }
});

router.get('/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  const page = Number(req.query.get(PARAM_PAGE) || 1);

  const errors = [];
  const warnings = [];
  const perPage = Incident.perPage;

  let source;
  let description = metaHelper.getDetailDescription();
  let incidentsStats;
  let data;
  let meta;

  try {
    source = await sources.getAtId(id);
    adapted = source.adapted;

    description = metaHelper.getDetailDescription(adapted.title, 'from');
    section.id = adapted.id;
    section.subtitle = adapted.title;
  } catch (err) {
    console.error('Error while getting person:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }

  if (req.get('Content-Type') === headers.json) {
    try {
      if (source.data.type === Source.types.activity) {
        incidentsStats = await stats.getIncidentsStats({
          sourceId: id,
        });

        source.setOverview(incidentsStats);

        data = {
          source: {
            record: source.adapted,
          },
        };
        meta = {
          description,
          errors,
          id,
          page,
          pageTitle: metaHelper.getPageTitle(section),
          perPage,
          section,
          view,
          warnings,
        };
      } else {
        data = {
          source: {
            record: source.adapted,
          },
        };
        meta = {
          description,
          errors,
          id,
          pageTitle: metaHelper.getPageTitle(section),
          section,
          view,
          warnings,
        };
      }

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

router.get('/:id/attendees', async (req, res, next) => {
  if (req.get('Content-Type') === headers.json) {
    const id = req.params.id;

    let source;
    let attendees;
    let data;
    let meta;

    try {
      source = await sources.getAtId(id);
      record = source.adapted;
      attendees = await incidentAttendees.getAttendees({ sourceId: id });

      data = {
        source: {
          record: {
            ...record,
            attendees: {
              label: `These people appear in ${record.title}`,
              lobbyists: {
                label: 'Lobbyists',
                records: attendees.lobbyists.records,
              },
              officials: {
                label: 'City Officials',
                records: attendees.officials.records,
              },
            },
          },
        },
      };
      meta = { id, view };

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting source attendees:', err.message); // eslint-disable-line no-console
      next(createError(err));
    }
  } else {
    res.render(template, { title, robots: headers.robots });
  }
});

router.get('/:id/entities', async (req, res, next) => {
  if (req.get('Content-Type') === headers.json) {
    const id = req.params.id;

    let source;
    let record;
    let entities;
    let data;
    let meta;

    try {
      source = await sources.getAtId(id);
      entities = await sources.getEntitiesForId(id);

      record = source.adapted;

      data = {
        source: {
          record: {
            ...record,
            entities,
          },
        },
      };
      meta = { id, view };

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting source entities:', err.message); // eslint-disable-line no-console
      next(createError(err));
    }
  } else {
    res.render(template, { title, robots: headers.robots });
  }
});

router.get('/:id/incidents', async (req, res, next) => {
  const id = Number(req.params.id);
  const page = Number(req.query.get(PARAM_PAGE) || 1);
  const dateOn = req.query.get(PARAM_DATE_ON);
  const dateRangeFrom = req.query.get(PARAM_DATE_RANGE_FROM);
  const dateRangeTo = req.query.get(PARAM_DATE_RANGE_TO);
  const sort = req.query.get(PARAM_SORT);
  const withEntityId = req.query.get(PARAM_WITH_ENTITY_ID);
  const withPersonId = req.query.get(PARAM_WITH_PERSON_ID);

  const errors = [];
  const warnings = [];
  const perPage = Incident.perPage;
  const links = linkHelper.links;

  let source;
  let paginationTotal;
  let sourceIncidents;
  let records;
  let filters;
  let params;
  let data;
  let meta;

  try {
    source = await sources.getAtId(id);
  } catch (err) {
    console.error('Error while getting person:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }

  if (req.get('Content-Type') === headers.json) {
    try {
      if (source.data.type === Source.types.activity) {
        paginationTotal = await stats.getPaginationStats({
          dateOn,
          dateRangeFrom,
          dateRangeTo,
          sourceId: id,
          withEntityId,
          withPersonId,
        });
        sourceIncidents = await incidents.getAll({
          dateOn,
          dateRangeFrom,
          dateRangeTo,
          page,
          perPage,
          sort,
          sourceId: id,
          withEntityId,
          withPersonId,
        });
        sourceIncidents = sourceIncidents.map(incident => incident.adapted);

        records = await incidentAttendees.getAllForIncidents(sourceIncidents);

        filters = paramHelper.getFilters(req.query);
        params = paramHelper.getParamsFromFilters(filters);

        data = {
          source: {
            record: {
              id,
              incidents: {
                records,
                filters,
                pagination: linkHelper.getPagination({
                  page,
                  params,
                  path: links.source(id),
                  perPage,
                  total: paginationTotal,
                }),
              },
            },
          },
        };
        meta = {
          errors,
          id,
          page,
          perPage,
          warnings,
        };
      } else {
        data = {};
        meta = {};
      }

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting source:', err.message); // eslint-disable-line no-console
      next(createError(err));
    }
  } else {
    res.render(template, { title, robots: headers.robots });
  }
});

module.exports = router;
