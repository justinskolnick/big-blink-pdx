const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const linkHelper = require('../helpers/links');
const metaHelper = require('../helpers/meta');
const paramHelper = require('../helpers/param');

const headers = require('../lib/headers');
const { snakeCase } = require('../lib/string');

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
        source.setIncidentStats();

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
  const id = req.params.id;
  const page = req.query.get('page') || 1;
  const sort = req.query.get('sort');
  const withEntityId = req.query.get('with_entity_id');
  const withPersonId = req.query.get('with_person_id');

  const params = {};
  const perPage = Incident.perPage;
  const links = linkHelper.links;

  let source;
  let record;
  let description = metaHelper.getDetailDescription();
  let incidentsStats;
  let sourceIncidents;
  let records;
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
        incidentsStats = await stats.getIncidentsStats({ sourceId: id, withEntityId, withPersonId });
        source.setIncidentStats(incidentsStats);

        sourceIncidents = await incidents.getAll({
          page,
          perPage,
          sourceId: id,
          sort,
          withEntityId,
          withPersonId,
        });
        sourceIncidents = sourceIncidents.map(incident => incident.adapted);

        records = await incidentAttendees.getAllForIncidents(sourceIncidents);

        if (paramHelper.hasSort(sort)) {
          params.sort = paramHelper.getSort(sort);
        }
        if (withEntityId) {
          params[snakeCase('withEntityId')] = Number(withEntityId);
        }
        if (withPersonId) {
          params[snakeCase('withPersonId')] = Number(withPersonId);
        }

        record = source.adapted;

        data = {
          source: {
            record: {
              ...record,
              incidents: {
                ...record.incidents,
                records,
                filters: params,
                pagination: linkHelper.getPagination({
                  page,
                  params,
                  path: links.source(id),
                  perPage,
                  total: incidentsStats.paginationTotal,
                }),
              },
            },
          },
        };
        meta = {
          description,
          id,
          page,
          pageTitle: metaHelper.getPageTitle(section),
          perPage,
          section,
          view,
        };
      } else {
        record = source.adapted;

        data = {
          source: {
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

module.exports = router;
