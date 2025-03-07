const createError = require('http-errors');
const express = require('express');
const router = express.Router();

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
  const page = req.query.get('page') || 1;
  const sort = req.query.get('sort');
  const sortBy = req.query.get('sort_by');

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
        person.setIncidentStats();

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
  const id = req.params.id;
  const page = req.query.get('page') || 1;
  const dateOn = req.query.get('date_on');
  const quarter = req.query.get('quarter');
  const sort = req.query.get('sort');
  const withEntityId = req.query.get('with_entity_id');
  const withPersonId = req.query.get('with_person_id');

  const errors = [];
  const warnings = [];
  const perPage = Incident.perPage;
  const links = linkHelper.links;

  let quarterSourceId;
  let person;
  let record;
  let adapted;
  let description;
  let incidentsStats;
  let personIncidents;
  let records;
  let filters;
  let params;
  let data;
  let meta;

  try {
    person = await people.getAtId(id);
    adapted = person.adapted;

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
      incidentsStats = await stats.getIncidentsStats({ personId: id, dateOn, quarterSourceId, withEntityId, withPersonId });
      person.setIncidentStats(incidentsStats);

      personIncidents = await incidentAttendances.getAll({
        dateOn,
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

      record = person.adapted;

      data = {
        person: {
          record: {
            ...record,
            incidents: {
              ...record.incidents,
              records,
              filters,
              pagination: linkHelper.getPagination({
                page,
                params,
                path: links.person(id),
                perPage,
                total: incidentsStats.paginationTotal,
              }),
            }
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
