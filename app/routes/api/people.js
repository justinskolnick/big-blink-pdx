const createError = require('http-errors');
const express = require('express');

const {
  MODEL_ENTITIES,
  MODEL_PEOPLE,
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
  PARAM_WITH_ENTITY_ID,
  PARAM_WITH_PERSON_ID,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
  SECTION_PEOPLE,
} = require('../../config/constants');

const linkHelper = require('../../helpers/links');
const metaHelper = require('../../helpers/meta');

const { getFilters } = require('../../lib/filters/incident');
const searchParams = require('../../lib/request/search-params');

const Entity = require('../../models/entity');
const Incident = require('../../models/incident');
const OfficialPosition = require('../../models/official-position');
const Person = require('../../models/person/person');

const incidentAttendees = require('../../services/incident-attendees');
const incidents = require('../../services/incidents');
const officialPositions = require('../../services/official-positions');
const people = require('../../services/people');
const sources = require('../../services/sources');
const stats = require('../../services/stats');

const title = 'People';
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

const router = express.Router({
  mergeParams: true,
});

router.get('/', async (req, res, next) => {
  const page = req.searchParams.get(PARAM_PAGE) || 1;
  const sort = req.searchParams.get(PARAM_SORT);
  const sortBy = req.searchParams.get(PARAM_SORT_BY);

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

  try {
    incidentCountResult = await incidents.getTotal();

    peopleResult = await people.getAll({
      page,
      perPage,
      includeTotal: true,
      sort,
      sortBy,
    });
    peopleResult = peopleResult.map(person => {
      person.setGlobalIncidentCount(incidentCountResult);
      person.setOverview();

      return person.adapted;
    });

    personTotal = await people.getTotal();

    if (searchParams.hasSort(sort)) {
      params.sort = searchParams.getSort(sort);
    }
    if (sortBy) {
      params.sort_by = searchParams.getSortBy(sortBy); // eslint-disable-line camelcase
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
    meta = metaHelper.getMeta(req, {
      description,
      page,
      section,
      view,
    });

    res.status(200).json({ title, data, meta });
  } catch (err) {
    console.error('Error while getting people:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

router.get('/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  const page = req.searchParams.get(PARAM_PAGE) || 1;

  const perPage = Incident.perPage;

  const labelPrefix = 'person';

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
    adapted = person.adapted;

    description = metaHelper.getDetailDescription(adapted.name);
    section.id = adapted.id;
    section.subtitle = adapted.name;
  } else {
    return next(createError(404, `No record was found with an ID of ${id}`));
  }

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

    let labelKey;

    if (hasBeenEmployee || hasBeenLobbied) {
      if (hasLobbied) {
        labelKey = 'has_been_both';
      } else {
        labelKey = 'has_been_official';
      }
    } else if (hasLobbied) {
      labelKey = 'has_been_lobbyist';
    }

    if (labelKey) {
      record.details.description = Person.getLabel(labelKey, labelPrefix);
    }

    data = {
      person: {
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
    console.error('Error while getting person:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

router.get('/:id/attendees', async (req, res, next) => {
  const id = Number(req.params.id);
  const limit = req.searchParams.get(PARAM_LIMIT);

  const labelPrefix = 'person';

  let person;
  let record;
  let asLobbyist;
  let asOfficial;
  let data;
  let meta;

  try {
    person = await people.getAtId(id);

    asLobbyist = await incidentAttendees.getAttendees({ personId: id, personRole: ROLE_LOBBYIST }, limit);
    asOfficial = await incidentAttendees.getAttendees({ personId: id, personRole: ROLE_OFFICIAL }, limit);

    record = person.adapted;
    record.attendees = {
      roles: [],
    };

    if (asLobbyist.lobbyists.total > 0 || asLobbyist.officials.total > 0) {
      record.attendees.roles.push({
        label: Person.getLabel('as_lobbyist_with_name', labelPrefix, { name: record.name }),
        model: MODEL_PEOPLE,
        role: ROLE_LOBBYIST,
        type: 'person',
        values: [
          {
            label: Person.getLabel('as_lobbyist_lobbyists_contd', labelPrefix),
            records: asLobbyist.lobbyists.records.map(adaptItemPerson),
            role: asLobbyist.lobbyists.role,
            total: asLobbyist.lobbyists.total,
          },
          {
            label: Person.getLabel('as_lobbyist_officials_contd', labelPrefix),
            records: asLobbyist.officials.records.map(adaptItemPerson),
            role: asLobbyist.officials.role,
            total: asLobbyist.officials.total,
          },
        ],
      });
    }

    if (asOfficial.lobbyists.total > 0 || asOfficial.officials.total > 0) {
      record.attendees.roles.push({
        label: Person.getLabel('as_official_with_name', labelPrefix, { name: record.name }),
        model: MODEL_PEOPLE,
        role: ROLE_OFFICIAL,
        type: 'person',
        values: [
          {
            label: Person.getLabel('as_official_lobbyists', labelPrefix),
            records: asOfficial.lobbyists.records.map(adaptItemPerson),
            role: asOfficial.lobbyists.role,
            total: asOfficial.lobbyists.total,
          },
          {
            label: Person.getLabel('as_official_officials', labelPrefix),
            records: asOfficial.officials.records.map(adaptItemPerson),
            role: asOfficial.officials.role,
            total: asOfficial.officials.total,
          },
        ],
      });
    }

    data = {
      person: {
        record,
      },
    };
    meta = metaHelper.getMeta(req, { id, view });

    res.status(200).json({ title, data, meta });
  } catch (err) {
    console.error('Error while getting person attendees:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

router.get('/:id/entities', async (req, res, next) => {
  const id = Number(req.params.id);
  const limit = req.searchParams.get(PARAM_LIMIT);

  const labelPrefix = 'person';

  let person;
  let record;
  let asLobbyist;
  let asOfficial;
  let data;
  let meta;

  try {
    person = await people.getAtId(id);
    asLobbyist = await incidentAttendees.getEntities({ personId: id, personRole: ROLE_LOBBYIST }, limit);
    asOfficial = await incidentAttendees.getEntities({ personId: id, personRole: ROLE_OFFICIAL }, limit);

    record = person.adapted;
    record.entities = {
      roles: [],
    };

    if (asLobbyist.total) {
      record.entities.roles.push({
        label: Person.getLabel('as_lobbyist_entities', labelPrefix, { name: record.name }),
        model: MODEL_ENTITIES,
        role: ROLE_LOBBYIST,
        values: [
          {
            records: asLobbyist.records.map(adaptItemEntity),
            role: asLobbyist.role,
            total: asLobbyist.total,
          },
        ],
      });
    }

    if (asOfficial.total) {
      record.entities.roles.push({
        label: Person.getLabel('as_official_entities', labelPrefix, { name: record.name }),
        model: MODEL_ENTITIES,
        role: ROLE_OFFICIAL,
        values: [
          {
            records: asOfficial.records.map(adaptItemEntity),
            role: asLobbyist.role,
            total: asOfficial.total,
          },
        ],
      });
    }

    data = {
      person: {
        record,
      },
    };
    meta = metaHelper.getMeta(req, { id, view });

    res.status(200).json({ title, data, meta });
  } catch (err) {
    console.error('Error while getting person entities:', err.message); // eslint-disable-line no-console
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
  const quarter = req.searchParams.get(PARAM_QUARTER);
  const role = req.searchParams.get(PARAM_ROLE);
  const sort = req.searchParams.get(PARAM_SORT);
  const withEntityId = req.searchParams.get(PARAM_WITH_ENTITY_ID);
  const withPersonId = req.searchParams.get(PARAM_WITH_PERSON_ID);

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

  const peopleArray = searchParams.getPeople(people);
  const quarterSlug = searchParams.migrateQuarterSlug(quarter);

  if (quarterSlug) {
    quarterSourceId = await sources.getIdForQuarter(quarterSlug);
  }

  const options = {
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
  const incidentsOptions = {
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

    filters = getFilters(req.query);
    params = searchParams.getParamsFromFilters(req.query, filters);

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
    meta = metaHelper.getMeta(req, {
      id,
      page,
      perPage,
    });

    res.status(200).json({ title, data, meta });
  } catch (err) {
    console.error('Error while getting person:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

router.get('/:id/official-positions', async (req, res, next) => {
  const id = Number(req.params.id);

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
    meta = metaHelper.getMeta(req, { id, view });

    res.status(200).json({ title, data, meta });
  } catch (err) {
    console.error('Error while getting person official positions:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

router.get('/:id/roles', async (req, res, next) => {
  const id = Number(req.params.id);
  const limit = req.searchParams.get(PARAM_LIMIT);

  const labelPrefix = 'person';

  let person;
  let record;
  let asLobbyistAttendees;
  let asOfficialAttendees;
  let asLobbyistEntities;
  let asOfficialEntities;
  let data;
  let meta;

  try {
    person = await people.getAtId(id);

    const results = await Promise.all([
      incidentAttendees.getAttendees({ personId: id, personRole: ROLE_LOBBYIST }, limit),
      incidentAttendees.getAttendees({ personId: id, personRole: ROLE_OFFICIAL }, limit),
      incidentAttendees.getEntities({ personId: id, personRole: ROLE_LOBBYIST }, limit),
      incidentAttendees.getEntities({ personId: id, personRole: ROLE_OFFICIAL }, limit),
    ]);
    [
      asLobbyistAttendees,
      asOfficialAttendees,
      asLobbyistEntities,
      asOfficialEntities,
    ] = results;

    record = person.adapted;
    record.roles = {
      lobbyist: null,
      official: null,
    };

    const getRoleObject = (role) => ({
      label: Person.getLabel(`as_${role}`, labelPrefix),
      role,
      attendees: null,
      entities: null,
    });

    const getAssociatedNamesObject = () => ({
      label: Person.getLabel('associated_names'),
      model: MODEL_PEOPLE,
      type: 'person',
      values: [],
    });

    const getAssociatedEntitiesObject = () => ({
      label: Person.getLabel('associated_entities'),
      model: MODEL_ENTITIES,
      type: 'entity',
      values: [],
    });

    if (asLobbyistAttendees.lobbyists.total > 0 || asLobbyistEntities.total > 0) {
      record.roles.lobbyist = getRoleObject(ROLE_LOBBYIST);
    }

    if (asOfficialAttendees.lobbyists.total > 0 || asOfficialEntities.total > 0) {
      record.roles.official = getRoleObject(ROLE_OFFICIAL);
    }

    if (asLobbyistAttendees.lobbyists.total > 0 || asLobbyistAttendees.officials.total > 0) {
      record.roles.lobbyist.attendees = getAssociatedNamesObject();
    }

    if (asLobbyistEntities.total > 0) {
      record.roles.lobbyist.entities = getAssociatedEntitiesObject();
    }

    if (asOfficialAttendees.lobbyists.total > 0 || asOfficialAttendees.officials.total > 0) {
      record.roles.official.attendees = getAssociatedNamesObject();
    }

    if (asOfficialEntities.total > 0) {
      record.roles.official.entities = getAssociatedEntitiesObject();
    }

    if (asLobbyistAttendees.lobbyists.total > 0 || asLobbyistAttendees.officials.total > 0) {
      record.roles.lobbyist.attendees.values.push(
        {
          label: Person.getLabel('as_lobbyist_lobbyists', labelPrefix),
          records: asLobbyistAttendees.lobbyists.records.map(adaptItemPerson),
          role: asLobbyistAttendees.lobbyists.role,
          total: asLobbyistAttendees.lobbyists.total,
        },
        {
          label: Person.getLabel('as_lobbyist_officials', labelPrefix),
          records: asLobbyistAttendees.officials.records.map(adaptItemPerson),
          role: asLobbyistAttendees.officials.role,
          total: asLobbyistAttendees.officials.total,
        },
      );
    }

    if (asLobbyistEntities.total > 0) {
      record.roles.lobbyist.entities.values.push({
        label: Person.getLabel('as_lobbyist_entities', labelPrefix, { name: record.name }),
        records: asLobbyistEntities.records.map(adaptItemEntity),
        role: asLobbyistEntities.role,
        total: asLobbyistEntities.total,
      });
    }

    if (asOfficialAttendees.lobbyists.total > 0 || asOfficialAttendees.officials.total > 0) {
      record.roles.official.attendees.values.push(
        {
          label: Person.getLabel('as_official_lobbyists', labelPrefix),
          records: asOfficialAttendees.lobbyists.records.map(adaptItemPerson),
          role: asOfficialAttendees.lobbyists.role,
          total: asOfficialAttendees.lobbyists.total,
        },
        {
          label: Person.getLabel('as_official_officials', labelPrefix),
          records: asOfficialAttendees.officials.records.map(adaptItemPerson),
          role: asOfficialAttendees.officials.role,
          total: asOfficialAttendees.officials.total,
        },
      );
    }

    if (asOfficialEntities.total > 0) {
      record.roles.official.entities.values.push({
        label: Person.getLabel('as_official_entities', labelPrefix, { name: record.name }),
        records: asOfficialEntities.records.map(adaptItemEntity),
        role: asOfficialEntities.role,
        total: asOfficialEntities.total,
      });
    }

    data = {
      person: {
        record,
      },
    };
    meta = metaHelper.getMeta(req, { id, view });

    res.status(200).json({ title, data, meta });
  } catch (err) {
    console.error('Error while getting person roles:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

router.get('/:id/stats', async (req, res, next) => {
  const id = Number(req.params.id);

  let statsResult;
  let data;
  let meta;

  try {
    statsResult = await stats.getStats({ personId: id });

    data = {
      stats: {
        person: {
          id,
          stats: statsResult,
        },
      },
    };
    meta = metaHelper.getMeta(req, { id, view });

    res.status(200).json({ title, data, meta });
  } catch (err) {
    console.error('Error while getting person stats:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

module.exports = router;
