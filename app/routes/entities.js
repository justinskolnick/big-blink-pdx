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
  SECTION_ENTITIES,
} = require('../config/constants');

const filterHelper = require('../helpers/filter');
const linkHelper = require('../helpers/links');
const metaHelper = require('../helpers/meta');
const paramHelper = require('../helpers/param');

const headers = require('../lib/headers');
const { toSentence } = require('../lib/string');

const Entity = require('../models/entity');
const Incident = require('../models/incident');
const Person = require('../models/person');

const entities = require('../services/entities');
const entityLobbyistLocations = require('../services/entity-lobbyist-locations');
const incidents = require('../services/incidents');
const incidentAttendees = require('../services/incident-attendees');
const sources = require('../services/sources');
const stats = require('../services/stats');

const title = 'Entities';
const template = 'main';
const slug = SECTION_ENTITIES;
const section = {
  slug,
  title,
};
const view = {
  section: slug,
};

const adaptItemPerson = item => {
  const person = new Person(item.person);

  item.person = person.adapted;

  return item;
};

router.get('/', async (req, res, next) => {
  const page = req.query.get(PARAM_PAGE) || 1;
  const sort = req.query.get(PARAM_SORT);
  const sortBy = req.query.get(PARAM_SORT_BY);

  const params = {};
  const perPage = Entity.perPage;
  const links = linkHelper.links;
  const description = metaHelper.getIndexDescription(SECTION_ENTITIES);

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
  const id = Number(req.params.id);
  const page = Number(req.query.get(PARAM_PAGE) || 1);

  const errors = [];
  const warnings = [];
  const perPage = Incident.perPage;

  let entity;
  let record;
  let adapted;
  let description;
  let incidentsStats;
  let entityLocations;
  let data;
  let meta;

  try {
    entity = await entities.getAtId(id);
  } catch (err) {
    console.error('Error while getting person:', err.message); // eslint-disable-line no-console
    return next(createError(err));
  }

  if (entity.exists) {
    adapted = entity.adapted;

    description = metaHelper.getDetailDescription(adapted.name);
    section.id = adapted.id;
    section.subtitle = adapted.name;
  } else {
    return next(createError(404, `No record was found with an ID of ${id}`));
  }

  if (req.get('Content-Type') === headers.json) {
    try {
      entityLocations = await entityLobbyistLocations.getAll({ entityId: id });
      incidentsStats = await stats.getIncidentsStats({
        entityId: id,
      });

      entity.setOverview(incidentsStats);

      record = entity.adapted;

      const hasDomain = Boolean(record.domain);
      const hasLocations = entityLocations.length;

      if (hasLocations || hasDomain) {
        record.details = {};
        section.details = [];

        if (hasLocations) {
          const location = toSentence(entityLocations.map(location => `${location.city}, ${location.region}`));

          record.details.description = location;
          section.details.push(location);
        }

        if (hasDomain) {
          record.details.domain = record.domain;
          section.details.push(record.domain);
        }
      }


      data = {
        entity: {
          record,
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
      return next(createError(err));
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
      attendees = await incidentAttendees.getAttendees({ entityId: id });

      record = entity.adapted;
      record.attendees = {
        label: `As an entity, ${record.name} ...`,
        lobbyists: {
          label: 'Through these lobbyists',
          records: attendees.lobbyists.records.map(adaptItemPerson),
        },
        officials: {
          label: 'Lobbied these City officials',
          records: attendees.officials.records.map(adaptItemPerson),
        },
      };

      data = {
        entity: {
          record,
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

router.get('/:id/incidents', async (req, res, next) => {
  const id = Number(req.params.id);
  const page = Number(req.query.get(PARAM_PAGE) || 1);
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
  let paginationTotal;
  let entityIncidents;
  let records;
  let filters;
  let params;
  let data;
  let meta;

  if (req.get('Content-Type') === headers.json) {
    if (paramHelper.hasQuarterAndYear(quarter)) {
      quarterSourceId = await sources.getIdForQuarter(quarter);
    }

    try {
      paginationTotal = await stats.getPaginationStats({
        dateOn,
        dateRangeFrom,
        dateRangeTo,
        entityId: id,
        quarterSourceId,
        withPersonId,
      });
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

      filters = filterHelper.getFilters(req.query);
      params = paramHelper.getParamsFromFilters(req.query, filters);

      data = {
        entity: {
          record: {
            id,
            incidents: {
              records,
              filters,
              pagination: linkHelper.getPagination({
                page,
                params,
                path: links.entity(id),
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

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting entity:', err.message); // eslint-disable-line no-console
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
