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
  PARAM_WITH_ENTITY_ID,
  PARAM_WITH_PERSON_ID,
} = require('../config/constants');

const linkHelper = require('../helpers/links');
const metaHelper = require('../helpers/meta');
const paramHelper = require('../helpers/param');

const headers = require('../lib/headers');

const Incident = require('../models/incident');
const Person = require('../models/person');

const incidentAttendances = require('../services/incident-attendances');
const incidentAttendees = require('../services/incident-attendees');
const incidents = require('../services/incidents');
const people = require('../services/people');
const sources = require('../services/sources');
const stats = require('../services/stats');

const title = 'People';
const template = 'main';
const slug = 'people';
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
  const perPage = Person.perPage;
  const links = linkHelper.links;
  const description = metaHelper.getIndexDescription('people');

  let peopleResult;
  let personTotal;
  let incidentCountResult;
  let data;
  let meta;

  section.id = null;
  section.subtitle = null;

  if (req.get('Content-Type') === headers.json) {
    try {
      incidentCountResult = await incidents.getTotal();

      peopleResult = await people.getAll({
        page,
        perPage,
        includeCount: true,
        sort,
        sortBy,
      });
      peopleResult = peopleResult.map(person => {
        person.setGlobalIncidentCount(incidentCountResult);
        person.setOverview();

        return person.adapted;
      });

      personTotal = await people.getTotal();

      if (paramHelper.hasSort(sort)) {
        params.sort = paramHelper.getSort(sort);
      }
      if (sortBy) {
        params.sort_by = paramHelper.getSortBy(sortBy); // eslint-disable-line camelcase
      }

      data = {
        people: {
          records: peopleResult,
          pagination: linkHelper.getPagination({
            total: personTotal,
            perPage,
            page,
            params,
            path: links.people(),
          }),
          total: personTotal,
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
      console.error('Error while getting people:', err.message); // eslint-disable-line no-console
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
  const dateOn = req.query.get(PARAM_DATE_ON);
  const dateRangeFrom = req.query.get(PARAM_DATE_RANGE_FROM);
  const dateRangeTo = req.query.get(PARAM_DATE_RANGE_TO);
  const quarter = req.query.get(PARAM_QUARTER);
  const sort = req.query.get(PARAM_SORT);
  const withEntityId = req.query.get(PARAM_WITH_ENTITY_ID);
  const withPersonId = req.query.get(PARAM_WITH_PERSON_ID);

  const errors = [];
  const warnings = [];
  const perPage = Incident.perPage;

  let quarterSourceId;
  let person;
  let adapted;
  let description;
  let incidentsStats;
  let data;
  let meta;

  try {
    person = await people.getAtId(id);
  } catch (err) {
    console.error('Error while getting person:', err.message); // eslint-disable-line no-console
    return next(createError(err));
  }

  if (person.exists) {
    if (person.hasMoved && req.get('Content-Type') !== headers.json) {
      return res.redirect(`/people/${person.identicalId}`);
    }

    adapted = person.adapted;

    description = metaHelper.getDetailDescription(adapted.name);
    section.id = adapted.id;
    section.subtitle = adapted.name;
  } else {
    return next(createError(404, `No record was found with an ID of ${id}`));
  }

  if (req.get('Content-Type') === headers.json) {
    if (paramHelper.hasQuarterAndYear(quarter)) {
      quarterSourceId = await sources.getIdForQuarter(quarter);
    }

    try {
      incidentsStats = await stats.getIncidentsStats({
        personId: id,
      });
      personIncidents = await incidentAttendances.getAll({
        dateOn,
        dateRangeFrom,
        dateRangeTo,
        page,
        perPage,
        personId: id,
        quarterSourceId,
        sort,
        withEntityId,
        withPersonId,
      });

      person.setOverview(incidentsStats);

      data = {
        person: {
          record: person.adapted,
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
      console.error('Error while getting person:', err.message); // eslint-disable-line no-console
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

    let person;
    let record;
    let asLobbyist;
    let asOfficial;
    let data;
    let meta;

    try {
      person = await people.getAtId(id);
      record = person.adapted;

      asLobbyist = await incidentAttendees.getAttendees({ personId: id, personRole: 'lobbyist' });
      asOfficial = await incidentAttendees.getAttendees({ personId: id, personRole: 'official' });

      data = {
        person: {
          record: {
            ...record,
            attendees: {
              asLobbyist: {
                label: `As a lobbyist, ${record.name} ...`,
                lobbyists: {
                  label: 'Alongside these lobbyists',
                  records: asLobbyist.lobbyists.records,
                },
                officials: {
                  label: 'Lobbied these City officials',
                  records: asLobbyist.officials.records,
                },
              },
              asOfficial: {
                label: `As a City official, ${record.name} ...`,
                lobbyists: {
                  label: 'Was lobbied by these lobbyists',
                  records: asOfficial.lobbyists.records,
                },
                officials: {
                  label: 'Alongside these City officials',
                  records: asOfficial.officials.records,
                },
              },
            },
          },
        },
      };
      meta = { id, view };

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting person attendees:', err.message); // eslint-disable-line no-console
      next(createError(err));
    }
  } else {
    res.render(template, { title, robots: headers.robots });
  }
});

router.get('/:id/entities', async (req, res, next) => {
  const id = req.params.id;

  if (req.get('Content-Type') === headers.json) {
    let person;
    let record;
    let asLobbyist;
    let asOfficial;
    let data;
    let meta;

    try {
      person = await people.getAtId(id);
      record = person.adapted;
      asLobbyist = await incidentAttendees.getEntities({ personId: id, personRole: 'lobbyist' });
      asOfficial = await incidentAttendees.getEntities({ personId: id, personRole: 'official' });

      data = {
        person: {
          record: {
            ...record,
            entities: {
              asLobbyist,
              asOfficial,
            },
          },
        },
      };
      meta = { id, view };

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting person entities:', err.message); // eslint-disable-line no-console
      next(createError(err));
    }
  } else {
    res.redirect(`/people/${id}`);
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
  const withEntityId = req.query.get(PARAM_WITH_ENTITY_ID);
  const withPersonId = req.query.get(PARAM_WITH_PERSON_ID);

  const errors = [];
  const warnings = [];
  const perPage = Incident.perPage;
  const links = linkHelper.links;

  let quarterSourceId;
  let paginationTotal;
  let personIncidents;
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
        personId: id,
        quarterSourceId,
        withEntityId,
        withPersonId,
      });
      personIncidents = await incidentAttendances.getAll({
        dateOn,
        dateRangeFrom,
        dateRangeTo,
        page,
        perPage,
        personId: id,
        quarterSourceId,
        sort,
        withEntityId,
        withPersonId,
      });
      personIncidents = personIncidents.map(incident => incident.adapted);

      records = await incidentAttendees.getAllForIncidents(personIncidents);

      filters = paramHelper.getFilters(req.query);
      params = paramHelper.getParamsFromFilters(filters);

      data = {
        person: {
          record: {
            id,
            incidents: {
              records,
              filters,
              pagination: linkHelper.getPagination({
                page,
                params,
                path: links.person(id),
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
      console.error('Error while getting person:', err.message); // eslint-disable-line no-console
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
      statsResult = await stats.getStats({ personId: id });

      data = {
        stats: {
          person: {
            id: Number(id),
            stats: statsResult,
          },
        },
      };
      meta = { id, view };

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting person stats:', err.message); // eslint-disable-line no-console
      next(createError(err));
    }
  } else {
    res.redirect(`/people/${id}`);
  }
});

module.exports = router;
