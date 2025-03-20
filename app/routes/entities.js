const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const {
  PARAM_DATE_ON,
  PARAM_DATE_RANGE_FROM,
  PARAM_DATE_RANGE_TO,
  PARAM_PAGE,
  PARAM_QUARTER,
  PARAM_SORT,
  PARAM_SORT_BY,
  PARAM_WITH_PERSON_ID,
} = require('../config/constants');

const linkHelper = require('../helpers/links');
const metaHelper = require('../helpers/meta');
const paramHelper = require('../helpers/param');

const headers = require('../lib/headers');
const { toSentence } = require('../lib/string');

const Entity = require('../models/entity');
const Incident = require('../models/incident');

const entities = require('../services/entities');
const entityLobbyistLocations = require('../services/entity-lobbyist-locations');
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
  const page = req.query.get(PARAM_PAGE) || 1;
  const sort = req.query.get(PARAM_SORT);
  const sortBy = req.query.get(PARAM_SORT_BY);

  const params = {};
  const perPage = Entity.perPage;
  const links = linkHelper.links;
  const description = metaHelper.getIndexDescription('entities');

  let entitiesResult;
  let entityTotal;
  let incidentCountResult;
  let data;
  let meta;

  section.id = null;
  section.subtitle = null;

  if (req.get('Content-Type') === headers.json) {
    try {
      incidentCountResult = await incidents.getTotal();

      entitiesResult = await entities.getAll({
        page,
        perPage,
        includeCount: true,
        sort,
        sortBy,
      });
      entitiesResult = entitiesResult.map(entity => {
        entity.setGlobalIncidentCount(incidentCountResult);
        entity.setOverview();

        return entity.adapted;
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
          records: entitiesResult,
          pagination: linkHelper.getPagination({
            total: entityTotal,
            perPage,
            page,
            params,
            path: links.entities(),
          }),
          total: entityTotal,
        },
      };
      meta = {
        description,
        page,
        pageTitle: metaHelper.getPageTitle(section),
        section,
        view,
      };

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting entities:', err.message); // eslint-disable-line no-console
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
  const page = req.query.get(PARAM_PAGE) || 1;
  const dateOn = req.query.get(PARAM_DATE_ON);
  const dateRangeFrom = req.query.get(PARAM_DATE_RANGE_FROM);
  const dateRangeTo = req.query.get(PARAM_DATE_RANGE_TO);
  const quarter = req.query.get(PARAM_QUARTER);
  const sort = req.query.get(PARAM_SORT);
  const withPersonId = req.query.get(PARAM_WITH_PERSON_ID);

  const errors = [];
  const warnings = [];
  const perPage = Incident.perPage;
  const links = linkHelper.links;

  let quarterSourceId;
  let entity;
  let record;
  let description;
  let incidentsStats;
  let entityIncidents;
  let entityLocations;
  let records;
  let filters;
  let params;
  let data;
  let meta;

  try {
    entity = await entities.getAtId(id);
    adapted = entity.adapted;

    description = metaHelper.getDetailDescription(adapted.name);
    section.id = adapted.id;
    section.subtitle = adapted.name;
  } catch (err) {
    console.error('Error while getting person:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }

  if (req.get('Content-Type') === headers.json) {
    if (paramHelper.hasQuarterAndYear(quarter)) {
      quarterSourceId = await sources.getIdForQuarter(quarter);
    }

    try {
      entityLocations = await entityLobbyistLocations.getAll({ entityId: id });
      incidentsStats = await stats.getIncidentsStats({
        dateOn,
        dateRangeFrom,
        dateRangeTo,
        entityId: id,
        quarterSourceId,
        withPersonId,
      });
      entity.setOverview(incidentsStats);

      entityIncidents = await incidents.getAll({
        page,
        perPage,
        entityId: id,
        dateOn,
        dateRangeFrom,
        dateRangeTo,
        quarterSourceId,
        sort,
        withPersonId,
      });
      entityIncidents = entityIncidents.map(incident => incident.adapted);

      records = await incidentAttendees.getAllForIncidents(entityIncidents);

      const hasDomain = Boolean(adapted.domain);
      const hasLocations = entityLocations.length;

      if (hasLocations || hasDomain) {
        section.details = [];

        if (hasLocations) {
          section.details.push(toSentence(entityLocations.map(location => `${location.city}, ${location.region}`)));
        }

        if (hasDomain) {
          section.details.push(adapted.domain);
        }
      }

      filters = paramHelper.getFilters(req.query);
      params = paramHelper.getParamsFromFilters(filters);

      record = entity.adapted;

      data = {
        entity: {
          record: {
            ...record,
            incidents: {
              ...record.incidents,
              records,
              filters,
              pagination: linkHelper.getPagination({
                page,
                params,
                path: links.entity(id),
                perPage,
                total: incidentsStats.paginationTotal,
              }),
            },
          },
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

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting entity:', err.message); // eslint-disable-line no-console
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

router.get('/:id/attendees', async (req, res, next) => {
  if (req.get('Content-Type') === headers.json) {
    const id = req.params.id;

    let entity;
    let attendees;
    let data;
    let meta;

    try {
      entity = await entities.getAtId(id);
      record = entity.adapted;
      attendees = await incidentAttendees.getAttendees({ entityId: id });

      data = {
        entity: {
          record: {
            ...record,
            attendees: {
              label: `As an entity, ${record.name} ...`,
              lobbyists: {
                label: 'Through these lobbyists',
                records: attendees.lobbyists.records,
              },
              officials: {
                label: 'Lobbied these City officials',
                records: attendees.officials.records,
              },
            },
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
