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
  ROLE_ENTITY,
  SECTION_ENTITIES,
} = require('../../config/constants');

const { Labels } = require('../../helpers/labels');
const linkHelper = require('../../helpers/links');
const metaHelper = require('../../helpers/meta');

const { getFilters } = require('../../lib/filters/incident');
const searchParams = require('../../lib/request/search-params');
const Meta = require('../../lib/route/meta');
const { toSentence } = require('../../lib/string');

const AssociatedPerson = require('../../models/associated/person');
const Entity = require('../../models/entity/entity');
const Incident = require('../../models/incident');
const Person = require('../../models/person/person');

const entities = require('../../services/entities');
const entityLobbyistLocations = require('../../services/entity-lobbyist-locations');
const incidents = require('../../services/incidents');
const incidentAttendees = require('../../services/incident-attendees');
const sources = require('../../services/sources');
const stats = require('../../services/stats');

const title = 'Entities';
const slug = SECTION_ENTITIES;
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

  let results;
  let entityTotal;
  let incidentCountResult;
  let data;
  let meta;

  try {
    incidentCountResult = await incidents.getTotal();

    results = await entities.getAll({
      page,
      perPage,
      includeTotal: true,
      sort,
      sortBy,
    });
    results = results.map(entity => {
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
        records: results,
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

    meta = new Meta(req);
    meta.setOtherValues({
      description: metaHelper.getIndexDescription(SECTION_ENTITIES),
      page,
      view,
    });

    res.status(200).json({
      title,
      data,
      meta: meta.toObject(),
      });
  } catch (err) {
    console.error('Error while getting entities:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

router.get('/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  const page = req.searchParams.get(PARAM_PAGE) || 1;

  const perPage = Incident.perPage;

  let result;
  let record;
  let incidentsStats;
  let entityLocations;
  let data;
  let meta;

  try {
    result = await entities.getAtId(id);
  } catch (err) {
    console.error('Error while getting person:', err.message); // eslint-disable-line no-console
    return next(createError(err));
  }

  if (!result?.exists) {
    return next(createError(404, `No record was found with an ID of ${id}`));
  }

  try {
    entityLocations = await entityLobbyistLocations.getAll({ entityId: id });
    incidentsStats = await stats.getIncidentsStats({
      entityId: id,
    });

    result.setOverview(incidentsStats);

    record = result.adapted;

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

    meta = new Meta(req, record);
    meta.setOtherValues({
      description: metaHelper.getDetailDescription(record.name),
      page,
      perPage,
      view,
    });

    res.status(200).json({
      title,
      data,
      meta: meta.toObject(),
    });
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

    meta = new Meta(req);
    meta.setOtherValues({
      id,
      page,
      perPage,
    });

    res.status(200).json({
      title,
      data,
      meta: meta.toObject(false),
    });
  } catch (err) {
    console.error('Error while getting entity:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

const getEntityRoleObject = async (entity, options = {}, limit = null) => {
  const {
    association,
    role,
  } = options;

  const entityId = entity.getData('id');

  let attendees;

  entity.setRole(role);

  if ([ASSOCIATION_LOBBYISTS, ASSOCIATION_OFFICIALS].includes(association)) {
    attendees = await incidentAttendees.getAttendees({
      association,
      entityId,
    }, limit);
  } else {
    const results = await Promise.all([
      incidentAttendees.getAttendees({ entityId }, limit),
    ]);

    [ attendees ] = results;
  }

  if (attendees?.lobbyists?.total > 0 || attendees?.officials?.total > 0) {
    const associatedPerson = new AssociatedPerson();

    associatedPerson.setAssociatedModel(Person);

    entity.role.setAttendees(associatedPerson.toRoleObject(role, attendees, Entity.labelPrefix));
  }

  return entity.role.toObject();
};

router.get('/:id/roles', async (req, res, next) => {
  const id = Number(req.params.id);
  const association = req.searchParams.get(PARAM_ASSOCIATION);
  const limit = req.searchParams.get(PARAM_LIMIT);
  const role = ROLE_ENTITY;

  const hasRole = Boolean(role) && Entity.isValidRoleOption(role);

  let result;
  let asRole;
  let record;
  let meta;

  try {
    result = await entities.getAtId(id);
    record = result.adapted;

    if (hasRole) {
      asRole = await getEntityRoleObject(result, { association, role }, limit);

      record.roles.named = {
        [role]: asRole,
      };
    }

    data = {
      entity: {
        record,
      },
    };

    meta = new Meta(req, record);
    meta.setOtherValues({
      id,
      view,
    });

    res.status(200).json({
      title,
      data,
      meta: meta.toObject(false),
    });
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

    meta = new Meta(req);
    meta.setOtherValues({
      id,
      view,
    });

    res.status(200).json({
      title,
      data,
      meta: meta.toObject(false),
    });
  } catch (err) {
    console.error('Error while getting entity:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

module.exports = router;
