const createError = require('http-errors');
const express = require('express');

const {
  ASSOCIATION_LOBBYISTS,
  ASSOCIATION_OFFICIALS,
  PARAM_ASSOCIATION,
  PARAM_DATE_ON,
  PARAM_DATE_RANGE_FROM,
  PARAM_DATE_RANGE_TO,
  PARAM_LIMIT,
  PARAM_PAGE,
  PARAM_PEOPLE,
  PARAM_QUARTER,
  PARAM_ROLE,
  PARAM_SORT,
  PARAM_SORT_BY,
  PARAM_WITH_PERSON_ID,
  ROLE_LOBBYIST,
  SECTION_ENTITIES,
} = require('../../config/constants');

const { Labels } = require('../../helpers/labels');
const linkHelper = require('../../helpers/links');
const metaHelper = require('../../helpers/meta');

const { getFilters } = require('../../lib/filters/incident');
const searchParams = require('../../lib/request/search-params');
const { toSentence } = require('../../lib/string');

const Entity = require('../../models/entity/entity');
const EntityAttendee = require('../../models/entity/entity-attendee');
const Incident = require('../../models/incident');

const entities = require('../../services/entities');
const entityLobbyistLocations = require('../../services/entity-lobbyist-locations');
const incidents = require('../../services/incidents');
const incidentAttendees = require('../../services/incident-attendees');
const sources = require('../../services/sources');
const stats = require('../../services/stats');

const title = 'Entities';
const slug = SECTION_ENTITIES;
const section = {
  slug,
  title,
};
const view = {
  section: slug,
};

const router = express.Router({
  mergeParams: true,
});

router.get('/', async (req, res, next) => {
  const page = req.searchParams.get(PARAM_PAGE) || 1;
  const sort = req.searchParams.get(PARAM_SORT);
  const sortBy = req.searchParams.get(PARAM_SORT_BY);

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

  try {
    incidentCountResult = await incidents.getTotal();

    entitiesResult = await entities.getAll({
      page,
      perPage,
      includeTotal: true,
      sort,
      sortBy,
    });
    entitiesResult = entitiesResult.map(entity => {
      entity.setGlobalIncidentCount(incidentCountResult);
      entity.setOverview();

      return entity.adapted;
    });

    entityTotal = await entities.getTotal();

    if (searchParams.hasSort(sort)) {
      params.sort = searchParams.getSort(sort);
    }
    if (searchParams.hasSortBy(sortBy)) {
      params.sort_by = searchParams.getSortBy(sortBy); // eslint-disable-line camelcase
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
    meta = metaHelper.getMeta(req, {
      description,
      page,
      section,
      view,
    });

    res.status(200).json({ title, data, meta });
  } catch (err) {
    console.error('Error while getting entities:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

router.get('/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  const page = req.searchParams.get(PARAM_PAGE) || 1;

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

      if (hasLocations) {
        const labels = new Labels();
        const location = toSentence(entityLocations.map(location => labels.getLabel('location', null, location)));

        record.details.description = location;
      }

      if (hasDomain) {
        record.details.domain = record.domain;
      }
    }

    data = {
      entity: {
        record,
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

    res.status(200).json({ title, data, meta });
  } catch (err) {
    console.error('Error while getting entity:', err.message); // eslint-disable-line no-console
    return next(createError(err));
  }
});

router.get('/:id/incidents', async (req, res, next) => {
  const id = Number(req.params.id);
  const page = req.searchParams.get(PARAM_PAGE) || 1;
  const dateOn = req.searchParams.get(PARAM_DATE_ON);
  const dateRangeFrom = req.searchParams.get(PARAM_DATE_RANGE_FROM);
  const dateRangeTo = req.searchParams.get(PARAM_DATE_RANGE_TO);
  const people = req.searchParams.get(PARAM_PEOPLE);
  const quarter = req.searchParams.get(PARAM_QUARTER);
  const role = req.searchParams.get(PARAM_ROLE);
  const sort = req.searchParams.get(PARAM_SORT);
  const withPersonId = req.searchParams.get(PARAM_WITH_PERSON_ID);

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

  const peopleArray = searchParams.getPeople(people);
  const quarterSlug = searchParams.migrateQuarterSlug(quarter);

  if (quarterSlug) {
    quarterSourceId = await sources.getIdForQuarter(quarterSlug);
  }

  const options = {
    dateOn,
    dateRangeFrom,
    dateRangeTo,
    entityId: id,
    people: peopleArray,
    quarterSourceId,
    role,
    withPersonId,
  };
  const incidentsOptions = {
    ...options,
    page,
    perPage,
    sort,
  };

  try {
    paginationTotal = await stats.getPaginationStats(options);
    entityIncidents = await incidents.getAll(incidentsOptions);

    entityIncidents = entityIncidents.map(incident => incident.adapted);

    records = await incidentAttendees.getAllForIncidents(entityIncidents);

    filters = getFilters(req.query);
    params = searchParams.getParamsFromFilters(req.query, filters);

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
    meta = metaHelper.getMeta(req, {
      id,
      page,
      perPage,
    });

    res.status(200).json({ title, data, meta });
  } catch (err) {
    console.error('Error while getting entity:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

const getRoleObject = (role) => ({
  label: Entity.getLabel('as_entity', Entity.labelPrefix),
  role,
  attendees: null,
});

const getEntityRoleObject = async (record, options = {}, limit = null) => {
  const {
    association,
    role,
  } = options;

  let obj = null;
  let attendees;

  if ([ASSOCIATION_LOBBYISTS, ASSOCIATION_OFFICIALS].includes(association)) {
    attendees = await incidentAttendees.getAttendees({
      association,
      entityId: record.id,
    }, limit);
  } else {
    const results = await Promise.all([
      incidentAttendees.getAttendees({ entityId: record.id }, limit),
    ]);

    [ attendees ] = results;
  }

  if (attendees?.lobbyists?.total > 0 || attendees?.officials?.total > 0) {
    obj = getRoleObject(role);

    if (attendees?.lobbyists?.total > 0 || attendees?.officials?.total > 0) {
      obj.attendees = EntityAttendee.toRoleObject(role, attendees);
    }
  }

  return obj;
};

router.get('/:id/roles', async (req, res, next) => {
  const id = Number(req.params.id);
  const association = req.searchParams.get(PARAM_ASSOCIATION);
  const limit = req.searchParams.get(PARAM_LIMIT);
  const role = ROLE_LOBBYIST;

  const hasAssociation = Boolean(association);

  let entity;
  let record;

  try {
    entity = await entities.getAtId(id);
    record = entity.adapted;

    if (hasAssociation) {
      asRole = await getEntityRoleObject(record, { association, role }, limit);

      record.roles.named = {
        [role]: asRole,
      };
    } else {
      asLobbyist = await getEntityRoleObject(record, { association, role: ROLE_LOBBYIST }, limit);

      record.roles.named = {
        [ROLE_LOBBYIST]: asLobbyist,
      };
    }

    data = {
      entity: {
        record,
      },
    };
    meta = metaHelper.getMeta(req, { id, view });

    res.status(200).json({ title, data, meta });
  } catch (err) {
    console.error('Error while getting entity roles:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

router.get('/:id/stats', async (req, res, next) => {
  const id = Number(req.params.id);

  let statsResult;
  let data;
  let meta;

  try {
    statsResult = await stats.getStats({ entityId: id });

    data = {
      stats: {
        entity: {
          id,
          stats: statsResult,
        },
      },
    };
    meta = metaHelper.getMeta(req, { id, view });

    res.status(200).json({ title, data, meta });
  } catch (err) {
    console.error('Error while getting entity:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

module.exports = router;
