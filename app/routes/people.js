const createError = require('http-errors');
const express = require('express');
const router = express.Router();
const { snakeCase } = require('snake-case');

const linkHelper = require('../helpers/links');
const paramHelper = require('../helpers/param');
const headers = require('../lib/headers');
const { PER_PAGE: INCIDENTS_PER_PAGE } = require('../models/incidents');
const { PER_PAGE } = require('../models/people');
const incidentAttendances = require('../services/incident-attendances');
const incidentAttendees = require('../services/incident-attendees');
const people = require('../services/people');
const sources = require('../services/sources');
const stats = require('../services/stats');

const title = 'People';
const template = 'main';
const view = {
  section: 'people',
};

router.get('/', async (req, res, next) => {
  if (req.get('Content-Type') === headers.json) {
    const page = req.query.get('page') || 1;
    const sortBy = req.query.get('sort_by');

    const params = {};
    const perPage = PER_PAGE;
    const links = linkHelper.links;

    let peopleResult;
    let personTotal;
    let data;
    let meta;

    try {
      peopleResult = await people.getAll({
        page,
        perPage,
        includeCount: true,
        sortBy,
      });
      personTotal = await people.getTotal();

      if (sortBy) {
        params.sort_by = sortBy; // eslint-disable-line camelcase
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
      meta = { page, view };

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting people:', err.message);
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
    const quarter = req.query.get('quarter');
    const withEntityId = req.query.get('with_entity_id');
    const withPersonId = req.query.get('with_person_id');

    const errors = [];
    const warnings = [];
    const params = {};
    const perPage = INCIDENTS_PER_PAGE;
    const links = linkHelper.links;

    let quarterSourceId;
    let person;
    let incidentsStats;
    let personIncidents;
    let records;
    let data;
    let meta;

    if (paramHelper.hasQuarterAndYear(quarter)) {
      quarterSourceId = await sources.getIdForQuarter(quarter);
    }

    try {
      person = await people.getAtId(id);
      incidentsStats = await stats.getIncidentsStats({ personId: id, quarterSourceId, withEntityId, withPersonId });
      personIncidents = await incidentAttendances.getAll({ page, perPage, personId: id, quarterSourceId, withEntityId, withPersonId });
      records = await incidentAttendees.getAllForIncidents(personIncidents);

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
              ...incidentsStats,
            },
          },
        },
      };
      meta = { errors, id, page, perPage, view, warnings };

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting person:', err.message);
      next(createError(err));
    }
  } else {
    res.render(template, { title, robots: headers.robots });
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
              asLobbyist,
              asOfficial,
            },
          },
        },
      };
      meta = { id, view };

      res.json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting person attendees:', err.message);
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
      console.error('Error while getting person entities:', err.message);
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
      console.error('Error while getting person stats:', err.message);
      next(createError(err));
    }
  } else {
    res.redirect(`/people/${id}`);
  }
});

module.exports = router;
