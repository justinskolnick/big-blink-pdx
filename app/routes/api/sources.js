const createError = require('http-errors');
const express = require('express');

const {
  ASSOCIATION_ENTITIES,
  ASSOCIATION_LOBBYISTS,
  ASSOCIATION_OFFICIALS,
  PARAM_ASSOCIATION,
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
  ROLE_SOURCE,
  SECTION_SOURCES,
} = require('../../config/constants');

const linkHelper = require('../../helpers/links');
const metaHelper = require('../../helpers/meta');

const { unique } = require('../../lib/array');
const { getFilters } = require('../../lib/filters/incident');
const searchParams = require('../../lib/request/search-params');
const Meta = require('../../lib/route/meta');

const AssociatedPerson = require('../../models/associated/person');
const AssociatedEntity = require('../../models/associated/entity');
const Entity = require('../../models/entity/entity');
const Incident = require('../../models/incident');
const Person = require('../../models/person/person');
const Source = require('../../models/source/source');

const incidents = require('../../services/incidents');
const incidentAttendees = require('../../services/incident-attendees');
const sources = require('../../services/sources');
const stats = require('../../services/stats');

const title = 'Data Sources';
const slug = SECTION_SOURCES;
const view = {
  section: slug,
};

const router = express.Router({
  mergeParams: true,
});

router.get('/', async (req, res, next) => {
  let activitySourcesResult;
  let registrationSourcesResult;
  let sourceTotal;
  let records;
  let types;
  let data;
  let meta;

  try {
    activitySourcesResult = await sources.getAll({
      includeTotal: true,
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

    meta = new Meta(req);
    meta.setOtherValues({
      description: metaHelper.getIndexDescription(),
      view,
    });

    res.status(200).json({
      title,
      data,
      meta: meta.toObject(),
    });
  } catch (err) {
    console.error('Error while getting sources:', err.message); // eslint-disable-line no-console
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
  let data;
  let meta;

  try {
    result = await sources.getAtId(id);
  } catch (err) {
    console.error('Error while getting person:', err.message); // eslint-disable-line no-console
    return next(createError(err));
  }

  if (result?.exists) {
    record = result.adapted;
  } else {
    return next(createError(404, `No record was found with an ID of ${id}`));
  }

  try {
    if (result.data.type === Source.types.activity) {
      incidentsStats = await stats.getIncidentsStats({
        sourceId: id,
      });

      result.setOverview(incidentsStats);
      record = result.adapted;

      data = {
        source: {
          record,
        },
      };

      meta = new Meta(req, record);
      meta.setOtherValues({
        description: metaHelper.getDetailDescription(record.title, 'from'),
        page,
        perPage,
        view,
      });
    } else {
      data = {
        source: {
          record,
        },
      };

      meta = new Meta(req, record);
      meta.setOtherValues({
        description: metaHelper.getDetailDescription(record.title, 'from'),
        view,
      });
    }

    res.status(200).json({
      title,
      data,
      meta: meta.toObject(),
    });
  } catch (err) {
    console.error('Error while getting source:', err.message); // eslint-disable-line no-console
    return next(createError(err));
  }
});

const getSourceRoleObject = async (source, options = {}, limit = null) => {
  const {
    association,
    role,
  } = options;

  const sourceId = source.getData('id');

  let attendees;
  let entities;

  source.setRole(role);

  if (association === ASSOCIATION_ENTITIES) {
    entities = await sources.getEntitiesForId(sourceId, limit);
  } else if ([ASSOCIATION_LOBBYISTS, ASSOCIATION_OFFICIALS].includes(association)) {
    attendees = await incidentAttendees.getAttendees({
      association,
      sourceId,
      personRole: role,
    }, limit);
  } else {
    const results = await Promise.all([
      incidentAttendees.getAttendees({ sourceId, personRole: role }, limit),
      sources.getEntitiesForId(sourceId, limit),
    ]);

    [ attendees, entities ] = results;
  }

  if (attendees?.lobbyists?.total > 0 || attendees?.officials?.total > 0 || entities?.total > 0) {
    const associatedEntity = new AssociatedEntity();
    const associatedPerson = new AssociatedPerson();

    associatedEntity.setAssociatedModel(Entity);
    associatedPerson.setAssociatedModel(Person);

    if (attendees?.lobbyists?.total > 0 || attendees?.officials?.total > 0) {
      source.role.setAttendees(associatedPerson.toRoleObject(role, attendees, Source.labelPrefix));
    }

    if (entities?.total > 0) {
      source.role.setEntities(associatedEntity.toRoleObject(role, entities, Source.labelPrefix));
    }
  }

  return source.role.toObject();
};

router.get('/:id/roles', async (req, res, next) => {
  const id = Number(req.params.id);
  const association = req.searchParams.get(PARAM_ASSOCIATION);
  const limit = req.searchParams.get(PARAM_LIMIT);
  const role = ROLE_SOURCE;

  const hasAssociation = Boolean(association);
  const hasRole = Boolean(role) && Source.isValidRoleOption(role);

  let result;
  let record;
  let asRole;
  let data;
  let meta;

  try {
    result = await sources.getAtId(id);
    record = result.adapted;

    if (hasAssociation && hasRole) {
      asRole = await getSourceRoleObject(result, { association, role }, limit);

      record.roles.named = {
        [role]: asRole,
      };
    } else {
      asRole = await getSourceRoleObject(result, { association, role }, limit);

      record.roles.named = {
        [role]: asRole,
      };
    }

    data = {
      source: {
        record,
      },
    };

    meta = new Meta(req, record);
    meta.setOtherValues({
      view,
    });

    res.status(200).json({
      title,
      data,
      meta: meta.toObject(false),
      });
  } catch (err) {
    console.error('Error while getting person roles:', err.message); // eslint-disable-line no-console
    next(createError(err));
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

  let result;
  let record;
  let paginationTotal;
  let sourceIncidents;
  let records;
  let filters;
  let params;
  let data;
  let meta;

  try {
    result = await sources.getAtId(id);
  } catch (err) {
    console.error('Error while getting person:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }

  const peopleArray = searchParams.getPeople(people);

  const options = {
    dateOn,
    dateRangeFrom,
    dateRangeTo,
    people: peopleArray,
    role,
    sourceId: id,
    withEntityId,
    withPersonId,
  };
  const incidentsOptions = {
    ...options,
    page,
    perPage,
    sort,
  };

  try {
    if (result.data.type === Source.types.activity) {
      record = result.adapted;

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

      meta = new Meta(req, record);
      meta.setOtherValues({
        page,
        perPage,
        view,
      });
    } else {
      data = {};
      meta = new Meta(req);
    }

    res.status(200).json({
      title,
      data,
      meta: meta.toObject(false),
    });
  } catch (err) {
    console.error('Error while getting source:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

module.exports = router;
