const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const linkHelper = require('../helpers/links');
const metaHelper = require('../helpers/meta');
const paramHelper = require('../helpers/param');
const headers = require('../lib/headers');
const { snakeCase } = require('../lib/string');
const { PER_PAGE } = require('../models/entities');
const { PER_PAGE: INCIDENTS_PER_PAGE } = require('../models/incidents');
const entities = require('../services/entities');
const antityLobbyistLocations = require('../services/entity-lobbyist-locations');
const incidents = require('../services/incidents');
const incidentAttendees = require('../services/incident-attendees');
const sources = require('../services/sources');
const stats = require('../services/stats');

const title = 'Entities';
const template = 'main';
const slug = 'entities';
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
  const sortBy = req.query.get('sort_by');

  const params = {};
  const perPage = PER_PAGE;
  const links = linkHelper.links;
  const description = metaHelper.getIndexDescription('entities');

  let allEntities;
  let entityTotal;
  let data;
  let meta;

  section.id = null;
  section.subtitle = null;

  if (req.get('Content-Type') === headers.json) {
    try {
      allEntities = await entities.getAll({
        page,
        perPage,
        includeCount: true,
        sort,
        sortBy,
      });
      entityTotal = await entities.getTotal();

      if (paramHelper.hasSort(sort)) {
        params.sort = paramHelper.getSort(sort);
      }
      if (paramHelper.hasSortBy(sortBy)) {
        params.sort_by = paramHelper.getSortBy(sortBy); // eslint-disable-line camelcase
      }

      data = {
        entities: {
          records: allEntities,
          pagination: linkHelper.getPagination({
            total: entityTotal,
            perPage,
            page,
            params,
            path: links.entities(),
          }),
          total: entityTotal,
        }
      };
      meta = {
        description,
        page,
        section,
        view,
      };

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting entities:', err.message); // eslint-disable-line no-console
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
  const quarter = req.query.get('quarter');
  const sort = req.query.get('sort');
  const withPersonId = req.query.get('with_person_id');

  const errors = [];
  const warnings = [];
  const params = {};
  const perPage = INCIDENTS_PER_PAGE;
  const links = linkHelper.links;

  let quarterSourceId;
  let entity;
  let description;
  let incidentsStats;
  let entityIncidents;
  let entityLocations;
  let records;
  let attendees;
  let data;
  let meta;

  try {
    entity = await entities.getAtId(id);
    description = metaHelper.getDetailDescription(entity.name);
    section.id = entity.id;
    section.subtitle = entity.name;
  } catch (err) {
    console.error('Error while getting person:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }

  if (req.get('Content-Type') === headers.json) {
    if (paramHelper.hasQuarterAndYear(quarter)) {
      quarterSourceId = await sources.getIdForQuarter(quarter);
    }

    try {
      entityLocations = await antityLobbyistLocations.getAll({ entityId: id });
      incidentsStats = await stats.getIncidentsStats({ entityId: id, quarterSourceId, withPersonId });
      entityIncidents = await incidents.getAll({
        page,
        perPage,
        entityId: id,
        quarterSourceId,
        sort,
        withPersonId,
      });
      records = await incidentAttendees.getAllForIncidents(entityIncidents);
      attendees = await incidentAttendees.getAttendees({ entityId: id });

      if (paramHelper.hasSort(sort)) {
        params.sort = paramHelper.getSort(sort);
      }
      if (quarterSourceId) {
        params[snakeCase('quarter')] = quarter;
      }
      if (withPersonId) {
        params[snakeCase('withPersonId')] = Number(withPersonId);
      }

      data = {
        entity: {
          record: {
            ...entity,
            locations: entityLocations,
            incidents: {
              records,
              filters: params,
              pagination: linkHelper.getPagination({
                page,
                params,
                path: links.entity(id),
                perPage,
                total: incidentsStats.paginationTotal,
              }),
              ...incidentsStats,
            },
            attendees,
          },
        },
      };
      meta = {
        description,
        errors,
        id,
        page,
        perPage,
        section,
        view,
        warnings,
      };

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting entity:', err.message); // eslint-disable-line no-console
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

    let entity;
    let attendees;
    let data;
    let meta;

    try {
      entity = await entities.getAtId(id);
      attendees = await incidentAttendees.getAttendees({ entityId: id });

      data = {
        entity: {
          record: {
            ...entity,
            attendees,
          },
        },
      };
      meta = { id, view };

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting entity attendees:', err.message); // eslint-disable-line no-console
      next(createError(err));
    }
  } else {
    res.render(template, { title, robots: headers.robots });
  }
});

router.get('/:id/stats', async (req, res, next) => {
  const id = req.params.id;

  if (req.get('Content-Type') === headers.json) {
    let statsResult;
    let data;
    let meta;

    try {
      statsResult = await stats.getStats({ entityId: id });

      data = {
        stats: {
          entity: {
            id: Number(id),
            stats: statsResult,
          },
        },
      };
      meta = { id, view };

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting entity:', err.message); // eslint-disable-line no-console
      next(createError(err));
    }
  } else {
    res.redirect(`/entities/${id}`);
  }
});

module.exports = router;
