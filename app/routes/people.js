const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const linkHelper = require('../helpers/links');
const metaHelper = require('../helpers/meta');
const paramHelper = require('../helpers/param');
const headers = require('../lib/headers');
const { snakeCase } = require('../lib/string');
const Incident = require('../models/incident');
const Person = require('../models/person');
const incidentAttendances = require('../services/incident-attendances');
const incidentAttendees = require('../services/incident-attendees');
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
  let data;
  let meta;

  section.id = null;
  section.subtitle = null;

  if (req.get('Content-Type') === headers.json) {
    try {
      peopleResult = await people.getAll({
        page,
        perPage,
        includeCount: true,
        sort,
        sortBy,
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
        }
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
  const quarter = req.query.get('quarter');
  const sort = req.query.get('sort');
  const withEntityId = req.query.get('with_entity_id');
  const withPersonId = req.query.get('with_person_id');

  const errors = [];
  const warnings = [];
  const params = {};
  const perPage = Incident.perPage;
  const links = linkHelper.links;

  let quarterSourceId;
  let person;
  let description;
  let incidentsStats;
  let personIncidents;
  let records;
  let data;
  let meta;

  try {
    person = await people.getAtId(id);
    description = metaHelper.getDetailDescription(person.name);
    section.id = person.id;
    section.subtitle = person.name;
  } catch (err) {
    console.error('Error while getting person:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }

  if (req.get('Content-Type') === headers.json) {
    if (paramHelper.hasQuarterAndYear(quarter)) {
      quarterSourceId = await sources.getIdForQuarter(quarter);
    }

    try {
      incidentsStats = await stats.getIncidentsStats({ personId: id, quarterSourceId, withEntityId, withPersonId });
      personIncidents = await incidentAttendances.getAll({
        page,
        perPage,
        personId: id,
        quarterSourceId,
        sort,
        withEntityId,
        withPersonId,
      });
      records = await incidentAttendees.getAllForIncidents(personIncidents);

      if (paramHelper.hasSort(sort)) {
        params.sort = paramHelper.getSort(sort);
      }
      if (quarterSourceId) {
        params[snakeCase('quarter')] = quarter;
      }
      if (withEntityId) {
        params[snakeCase('withEntityId')] = Number(withEntityId);
      }
      if (withPersonId) {
        params[snakeCase('withPersonId')] = Number(withPersonId);
      }

      data = {
        person: {
          record: {
            ...person,
            incidents: {
              records,
              filters: params,
              pagination: linkHelper.getPagination({
                total: incidentsStats.paginationTotal,
                perPage,
                page,
                path: links.person(id),
                params,
              }),
              stats: {
                first: {
                  label: 'First appearance',
                  value: incidentsStats.first,
                },
                last: {
                  label: 'Most recent appearance',
                  value: incidentsStats.last,
                },
                percentage: incidentsStats.percentage,
                total: incidentsStats.total,
              },
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
    let asLobbyist;
    let asOfficial;
    let data;
    let meta;

    try {
      person = await people.getAtId(id);
      asLobbyist = await incidentAttendees.getAttendees({ personId: id, personRole: 'lobbyist' });
      asOfficial = await incidentAttendees.getAttendees({ personId: id, personRole: 'official' });

      data = {
        person: {
          record: {
            ...person,
            attendees: {
              asLobbyist: {
                label: `As a lobbyist, ${person.name} ...`,
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
                label: `As a City official, ${person.name} ...`,
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
    let asLobbyist;
    let asOfficial;
    let data;
    let meta;

    try {
      person = await people.getAtId(id);
      asLobbyist = await incidentAttendees.getEntities({ personId: id, personRole: 'lobbyist' });
      asOfficial = await incidentAttendees.getEntities({ personId: id, personRole: 'official' });

      data = {
        person: {
          record: {
            ...person,
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
