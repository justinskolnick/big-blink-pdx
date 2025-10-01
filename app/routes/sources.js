const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const {
  MODEL_ENTITIES,
  MODEL_PEOPLE,
  PARAM_DATE_ON,
  PARAM_DATE_RANGE_FROM,
  PARAM_DATE_RANGE_TO,
  PARAM_LIMIT,
  PARAM_PAGE,
  PARAM_PEOPLE,
  PARAM_ROLE,
  PARAM_SORT,
  PARAM_WITH_ENTITY_ID,
  PARAM_WITH_PERSON_ID,
  SECTION_SOURCES,
} = require('../config/constants');

const linkHelper = require('../helpers/links');
const metaHelper = require('../helpers/meta');

const { unique } = require('../lib/array');
const headers = require('../lib/headers');
const { getFilters } = require('../lib/incident/filters');
const searchParams = require('../lib/request/search-params');

const Entity = require('../models/entity');
const Incident = require('../models/incident');
const Person = require('../models/person');
const Source = require('../models/source');

const incidents = require('../services/incidents');
const incidentAttendees = require('../services/incident-attendees');
const sources = require('../services/sources');
const stats = require('../services/stats');

const title = 'Data Sources';
const template = 'main';
const slug = SECTION_SOURCES;
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
  const description = metaHelper.getIndexDescription();

  let activitySourcesResult;
  let registrationSourcesResult;
  let sourceTotal;
  let records;
  let types;
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

      personnelSourcesResult = await sources.getAll({
        types: [Source.types.personnel],
      });
      personnelSourcesResult = personnelSourcesResult.map(source => source.adapted);

      registrationSourcesResult = await sources.getAll({
        types: [Source.types.registration],
      });
      registrationSourcesResult = registrationSourcesResult.map(source => source.adapted);

      sourceTotal = await sources.getTotal({
        types: [
          Source.types.activity,
          Source.types.personnel,
          Source.types.registration,
        ],
      });

      records = [].concat(
        activitySourcesResult,
        personnelSourcesResult,
        registrationSourcesResult
      );

      types = unique(records.map(record => record.type)).reduce((all, type) => {
        all[type] = {
          key: type,
          label: Source.getLabel(type, 'lobbying'),
        };

        return all;
      }, {});

      data = {
        sources: {
          records,
          total: sourceTotal,
          types,
        }
      };
      meta = metaHelper.getMeta(req, {
        description,
        section,
        view,
      });

      res.status(200).json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting sources:', err.message); // eslint-disable-line no-console
      next(createError(err));
    }
  } else {
    meta = metaHelper.getMeta(req, {
      description,
      section,
    });

    res.render(template, { title, meta, robots: headers.robots });
  }
});

router.get('/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  const page = req.searchParams.get(PARAM_PAGE) || 1;

  const perPage = Incident.perPage;

  let source;
  let adapted;
  let description = metaHelper.getDetailDescription();
  let incidentsStats;
  let data;
  let meta;

  try {
    source = await sources.getAtId(id);
  } catch (err) {
    console.error('Error while getting person:', err.message); // eslint-disable-line no-console
    return next(createError(err));
  }

  if (source.exists) {
    adapted = source.adapted;

    description = metaHelper.getDetailDescription(adapted.title, 'from');
    section.id = adapted.id;
    section.subtitle = adapted.title;
  } else {
    return next(createError(404, `No record was found with an ID of ${id}`));
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
        meta = metaHelper.getMeta(req, {
          description,
          id,
          page,
          perPage,
          section,
          view,
        });
      } else {
        data = {
          source: {
            record: source.adapted,
          },
        };
        meta = metaHelper.getMeta(req, {
          description,
          id,
          section,
          view,
        });
      }

      res.status(200).json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting source:', err.message); // eslint-disable-line no-console
      return next(createError(err));
    }
  } else {
    meta = metaHelper.getMeta(req, { description });

    res.render(template, { title, meta, robots: headers.robots });
  }
});

router.get('/:id/attendees', async (req, res, next) => {
  if (req.get('Content-Type') === headers.json) {
    const id = Number(req.params.id);
    const limit = req.searchParams.get(PARAM_LIMIT);

    let source;
    let record;
    let attendees;
    let data;
    let meta;

    try {
      source = await sources.getAtId(id);
      attendees = await incidentAttendees.getAttendees({ sourceId: id }, limit);

      record = source.adapted;
      record.attendees = {
        label: `These people appear in ${record.title}`,
        model: MODEL_PEOPLE,
        type: 'source',
        values: [
          {
            label: 'Lobbyists',
            records: attendees.lobbyists.records.map(adaptItemPerson),
            role: attendees.lobbyists.role,
            total: attendees.lobbyists.total,
          },
          {
            label: 'City Officials',
            records: attendees.officials.records.map(adaptItemPerson),
            role: attendees.officials.role,
            total: attendees.officials.total,
          },
        ],
      };

      data = {
        source: {
          record,
        },
      };
      meta = metaHelper.getMeta(req, { id, view });

      res.status(200).json({ title, data, meta });
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
    const id = Number(req.params.id);
    const limit = req.searchParams.get(PARAM_LIMIT);

    let source;
    let record;
    let entities;
    let data;
    let meta;

    try {
      source = await sources.getAtId(id);
      entities = await sources.getEntitiesForId(id, limit);

      record = source.adapted;
      record.entities = {
        label: `These entities appear in ${record.title}`,
        model: MODEL_ENTITIES,
        values: [
          {
            records: entities.records.map(adaptItemEntity),
            total: entities.total,
          },
        ],
      };

      data = {
        source: {
          record,
        },
      };
      meta = metaHelper.getMeta(req, { id, view });

      res.status(200).json({ title, data, meta });
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
  const page = req.searchParams.get(PARAM_PAGE) || 1;
  const dateOn = req.searchParams.get(PARAM_DATE_ON);
  const dateRangeFrom = req.searchParams.get(PARAM_DATE_RANGE_FROM);
  const dateRangeTo = req.searchParams.get(PARAM_DATE_RANGE_TO);
  const people = req.searchParams.get(PARAM_PEOPLE);
  const role = req.searchParams.get(PARAM_ROLE);
  const sort = req.searchParams.get(PARAM_SORT);
  const withEntityId = req.searchParams.get(PARAM_WITH_ENTITY_ID);
  const withPersonId = req.searchParams.get(PARAM_WITH_PERSON_ID);

  const perPage = Incident.perPage;
  const links = linkHelper.links;

  let source;
  let peopleArray;
  let options;
  let incidentsOptions;
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
    peopleArray = searchParams.getPeople(people);
    options = {
      dateOn,
      dateRangeFrom,
      dateRangeTo,
      people: peopleArray,
      role,
      sourceId: id,
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
      if (source.data.type === Source.types.activity) {
        paginationTotal = await stats.getPaginationStats(options);
        sourceIncidents = await incidents.getAll(incidentsOptions);

        sourceIncidents = sourceIncidents.map(incident => incident.adapted);

        records = await incidentAttendees.getAllForIncidents(sourceIncidents);

        filters = getFilters(req.query);
        params = searchParams.getParamsFromFilters(req.query, filters);

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
        meta = metaHelper.getMeta(req, {
          id,
          page,
          perPage,
        });
      } else {
        data = {};
        meta = {};
      }

      res.status(200).json({ title, data, meta });
    } catch (err) {
      console.error('Error while getting source:', err.message); // eslint-disable-line no-console
      next(createError(err));
    }
  } else {
    res.render(template, { title, robots: headers.robots });
  }
});

module.exports = router;
