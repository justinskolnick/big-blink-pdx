const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const {
  MODEL_ENTITIES,
  MODEL_PEOPLE,
  PARAM_DATE_ON,
  PARAM_DATE_RANGE_FROM,
  PARAM_DATE_RANGE_TO,
  PARAM_PAGE,
  PARAM_PEOPLE,
  PARAM_QUARTER,
  PARAM_ROLE,
  PARAM_SORT,
  PARAM_SORT_BY,
  PARAM_WITH_ENTITY_ID,
  PARAM_WITH_PERSON_ID,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
  SECTION_PEOPLE,
} = require('../config/constants');

const filterHelper = require('../helpers/filter');
const linkHelper = require('../helpers/links');
const metaHelper = require('../helpers/meta');
const paramHelper = require('../helpers/param');

const headers = require('../lib/headers');
const { toSentence } = require('../lib/string');

const Entity = require('../models/entity');
const Incident = require('../models/incident');
const OfficialPosition = require('../models/official-position');
const Person = require('../models/person');

const incidentAttendees = require('../services/incident-attendees');
const incidents = require('../services/incidents');
const officialPositions = require('../services/official-positions');
const people = require('../services/people');
const sources = require('../services/sources');
const stats = require('../services/stats');

const title = 'People';
const template = 'main';
const slug = SECTION_PEOPLE;
const section = {
  slug,
  title,
};
const view = {
  section: slug,
};

const adaptItemEntity = item => {
  const entity = new Entity(item.entity);

  item.entity = entity.adapted;

  return item;
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
  const perPage = Person.perPage;
  const links = linkHelper.links;
  const description = metaHelper.getIndexDescription(SECTION_PEOPLE);

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

      res.status(200).json({ title, data, meta });
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

  const errors = [];
  const warnings = [];
  const perPage = Incident.perPage;

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
    try {
      incidentsStats = await stats.getIncidentsStats({
        personId: id,
      });

      const {
        hasBeenEmployee,
        hasBeenLobbied,
        hasLobbied,
      } = await people.getHasLobbiedOrBeenLobbied(person);

      person.setOverview(incidentsStats);

      record = person.adapted;
      record.details = {};

      const roles = [];

      if (hasBeenEmployee || hasBeenLobbied) {
        roles.push('worked for the City');
      }

      if (hasLobbied) {
        roles.push('lobbied City officials');
      }

      if (roles.length) {
        record.details.description = `Has ${toSentence(roles)}`;
      }

      data = {
        person: {
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

      res.status(200).json({ title, data, meta });
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

      asLobbyist = await incidentAttendees.getAttendees({ personId: id, personRole: ROLE_LOBBYIST });
      asOfficial = await incidentAttendees.getAttendees({ personId: id, personRole: ROLE_OFFICIAL });

      const lobbyist = {
        lobbyists: asLobbyist.lobbyists.records.map(adaptItemPerson),
        officials: asLobbyist.officials.records.map(adaptItemPerson),
      };
      const official = {
        lobbyists: asOfficial.lobbyists.records.map(adaptItemPerson),
        officials: asOfficial.officials.records.map(adaptItemPerson),
      };

      record = person.adapted;
      record.attendees = {
        roles: [],
      };

      if (lobbyist.lobbyists.length || lobbyist.officials.length) {
        record.attendees.roles.push({
          label: `As a lobbyist, ${record.name} ...`,
          model: MODEL_PEOPLE,
          role: ROLE_LOBBYIST,
          type: 'person',
          values: [
            {
              label: '... lobbied alongside these lobbyists',
              records: lobbyist.lobbyists,
              role: ROLE_LOBBYIST,
            },
            {
              label: '... met with these City officials',
              records: lobbyist.officials,
              role: ROLE_OFFICIAL,
            },
          ],
        });
      }

      if (official.lobbyists.length || official.officials.length) {
        record.attendees.roles.push({
          label: `As a City official, ${record.name} ...`,
          model: MODEL_PEOPLE,
          role: ROLE_OFFICIAL,
          type: 'person',
          values: [
            {
              label: '... was lobbied by these lobbyists',
              records: official.lobbyists,
              role: ROLE_LOBBYIST,
            },
            {
              label: '... was lobbied alongside these City officials',
              records: official.officials,
              role: ROLE_OFFICIAL,
            },
          ],
        });
      }

      data = {
        person: {
          record,
        },
      };
      meta = { id, view };

      res.status(200).json({ title, data, meta });
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
      asLobbyist = await incidentAttendees.getEntities({ personId: id, personRole: ROLE_LOBBYIST });
      asOfficial = await incidentAttendees.getEntities({ personId: id, personRole: ROLE_OFFICIAL });

      const lobbyist = {
        records: asLobbyist.map(adaptItemEntity),
      };
      const official = {
        records: asOfficial.map(adaptItemEntity),
      };

      record = person.adapted;
      record.entities = {
        roles: [],
      };

      if (lobbyist.records.length) {
        record.entities.roles.push({
          label: `As a lobbyist, ${record.name} interacted with City officials on behalf of these entities`,
          model: MODEL_ENTITIES,
          role: ROLE_LOBBYIST,
          values: [
            {
              records: lobbyist.records,
              role: ROLE_LOBBYIST,
            },
          ],
        });
      }

      if (official.records.length) {
        record.entities.roles.push({
          label: `As a City official, ${record.name} was lobbied by representatives of these entities`,
          model: MODEL_ENTITIES,
          role: ROLE_OFFICIAL,
          values: [
            {
              records: official.records,
              role: ROLE_OFFICIAL,
            },
          ],
        });
      }

      data = {
        person: {
          record,
        },
      };
      meta = { id, view };

      res.status(200).json({ title, data, meta });
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
  const people = req.query.get(PARAM_PEOPLE);
  const quarter = req.query.get(PARAM_QUARTER);
  const role = req.query.get(PARAM_ROLE);
  const sort = req.query.get(PARAM_SORT);
  const withEntityId = req.query.get(PARAM_WITH_ENTITY_ID);
  const withPersonId = req.query.get(PARAM_WITH_PERSON_ID);

  const errors = [];
  const warnings = [];
  const perPage = Incident.perPage;
  const links = linkHelper.links;

  let peopleArray;
  let quarterSlug;
  let quarterSourceId;
  let options;
  let incidentsOptions;
  let paginationTotal;
  let personIncidents;
  let records;
  let filters;
  let params;
  let data;
  let meta;

  if (req.get('Content-Type') === headers.json) {
    peopleArray = paramHelper.getPeople(people);
    quarterSlug = paramHelper.migrateQuarterSlug(quarter);

    if (quarterSlug) {
      quarterSourceId = await sources.getIdForQuarter(quarterSlug);
    }

    options = {
      dateOn,
      dateRangeFrom,
      dateRangeTo,
      people: peopleArray,
      personId: id,
      quarterSourceId,
      role,
      withEntityId,
      withPersonId,
    };
    incidentsOptions = {
      ...options,
      page,
      perPage,
      sort,
    };

    try {
      paginationTotal = await stats.getPaginationStats(options);
      personIncidents = await incidents.getAll(incidentsOptions);

      personIncidents = personIncidents.map(incident => incident.adapted);

      records = await incidentAttendees.getAllForIncidents(personIncidents);

      filters = filterHelper.getFilters(req.query);
      params = paramHelper.getParamsFromFilters(req.query, filters);

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

      res.status(200).json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting person:', err.message); // eslint-disable-line no-console
      next(createError(err));
    }
  } else {
    res.render(template, { title, robots: headers.robots });
  }
});

router.get('/:id/official-positions', async (req, res, next) => {
  const id = Number(req.params.id);

  if (req.get('Content-Type') === headers.json) {
    let personResult;
    let officialPositionsResult;
    let records;
    let data;
    let meta;

    try {
      personResult = await people.getAtId(id);
      officialPositionsResult = await officialPositions.getAllAtPernr(personResult.pernr);
      records = OfficialPosition.collect(officialPositionsResult).map(result => result.adapted);

      data = {
        person: {
          record: {
            id,
            officialPositions: records,
          },
        },
      };
      meta = { id, view };

      res.status(200).json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting person official positions:', err.message); // eslint-disable-line no-console
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

      res.status(200).json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting person stats:', err.message); // eslint-disable-line no-console
      next(createError(err));
    }
  } else {
    res.redirect(`/people/${id}`);
  }
});

module.exports = router;
