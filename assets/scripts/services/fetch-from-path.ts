import { getError } from '../lib/error';
import store from '../lib/store';

import * as entityActions from '../reducers/entities';
import * as incidentActions from '../reducers/incidents';
import { actions as leaderboardActions } from '../reducers/leaderboard';
import * as personActions from '../reducers/people';
import * as sourceActions from '../reducers/sources';
import { actions as statsActions } from '../reducers/stats';
import { actions as uiActions } from '../reducers/ui';

import type { MaybeError } from '../lib/error';
import { RootState } from '../lib/store';
import type {
  EntityObject,
  EntityPayload,
  ErrorType,
  IncidentPayload,
  IncidentPayloadAttendeeGroup,
  IncidentPayloadAttendees,
  MetaType,
  PayloadNamedRoles,
  PersonObject,
  PersonPayload,
  PersonPayloadNamedRoles,
  SourcePayload,
  SourcePayloadNamedRoles,
  WarningType
} from '../types';

type DataType = any;

export type Result = {
  data: DataType;
  meta?: MetaType;
  title?: string;
};

const adaptEntity = (state: RootState, entity: EntityPayload) =>
  entityActions.adapters.adaptOne(state, entity);
const adaptIncident = (state: RootState, incident: IncidentPayload) =>
  incidentActions.adapters.adaptOne(state, incident);
const adaptIncidents = (state: RootState, incidents: IncidentPayload[]) =>
  incidents.map(incident => adaptIncident(state, incident));
const adaptPerson = (state: RootState, person: PersonPayload) =>
  personActions.adapters.adaptOne(state, person);
const adaptSource = (state: RootState, source: SourcePayload) =>
  sourceActions.adapters.adaptOne(state, source);

const getPeopleFromAttendees = (state: RootState, attendees: IncidentPayloadAttendees) =>
  Object.values(attendees)
    .filter((group: IncidentPayloadAttendeeGroup) => group && 'records' in group && group.records)
    .map((group: IncidentPayloadAttendeeGroup) => group.records)
    .flat()
    .map(attendee => attendee?.person)
    .map((person: PersonPayload) => adaptPerson(state, person));

const getPeopleFromIncident = (state: RootState, incident: IncidentPayload) =>
  getPeopleFromAttendees(state, incident.attendees);

const getPeopleFromIncidents = (state: RootState, incidents: IncidentPayload[]) => {
  if (incidents.length) {
    return incidents
      .map(incident => incident.attendees)
      .flatMap((attendees: IncidentPayloadAttendees) => getPeopleFromAttendees(state, attendees));
  }

  return [];
};

const getAttendeesFromRole = (state: RootState, roles: PayloadNamedRoles) => {
  const attendees = Object.values(roles)
    .filter(role => 'attendees' in role && role.attendees)
    .map(role => role.attendees)
    .filter(Boolean);

  if (attendees.length) {
    return attendees
      .flatMap(item => item.values)
      .flatMap(item => item.records)
      .map(record => record.person)
      .map((person: PersonPayload) => adaptPerson(state, person));
  }

  return [] as PersonObject[];
};

const getEntitiesFromRole = (state: RootState, roles: PersonPayloadNamedRoles | SourcePayloadNamedRoles) => {
  const entities = Object.values(roles)
    .filter(role => 'entities' in role && role.entities)
    .map(role => role.entities)
    .filter(Boolean);

  if (entities.length) {
    return entities
      .flatMap(item => item.values)
      .flatMap(item => item.records)
      .map(record => record.entity)
      .map((entity: EntityPayload) => adaptEntity(state, entity));
  }

  return [] as EntityObject[];
};

export const handleResult = (result: Result, isPrimary?: boolean) => {
  const dispatch = store.dispatch;
  const state = store.getState();
  const { data, meta } = result;

  if (data) {
    if ('stats' in data) {
      if ('sources' in data.stats) {
        dispatch(statsActions.setSources(data.stats.sources));
      }
      if ('entity' in data.stats) {
        dispatch(statsActions.setEntity(data.stats.entity));
      }
      if ('person' in data.stats) {
        dispatch(statsActions.setPerson(data.stats.person));
      }
    }

    if ('leaderboard' in data) {
      if ('filters' in data.leaderboard || 'labels' in data.leaderboard) {
        dispatch(leaderboardActions.setLeaderboard(data.leaderboard));
      }

      if ('values' in data.leaderboard) {
        if ('entities' in data.leaderboard.values) {
          dispatch(leaderboardActions.setLeaderboardEntities(data.leaderboard.values.entities));
        }
        if ('lobbyists' in data.leaderboard.values) {
          dispatch(leaderboardActions.setLeaderboardLobbyists(data.leaderboard.values.lobbyists));
        }
        if ('officials' in data.leaderboard.values) {
          dispatch(leaderboardActions.setLeaderboardOfficials(data.leaderboard.values.officials));
        }
      }
    }

    if ('entity' in data) {
      const entity = adaptEntity(state, data.entity.record);
      const incidents = entityActions.adapters.getIncidents(data.entity.record);
      const people = getPeopleFromIncidents(state, incidents);

      dispatch(entityActions.set(entity));

      if ('roles' in data.entity.record) {
        if ('named' in data.entity.record.roles) {
          const attendees = getAttendeesFromRole(state, data.entity.record.roles.named);

          if (attendees.length) {
            dispatch(personActions.setAll(attendees));
          }
        }
      }

      if (incidents.length) {
        dispatch(incidentActions.setAll(adaptIncidents(state, incidents)));
      }

      if (people.length) {
        dispatch(personActions.setAll(people));
      }
    }

    if ('entities' in data) {
      const entities = data.entities.records.map((entity: EntityPayload) => adaptEntity(state, entity));

      dispatch(entityActions.setAll(entities));

      if ('pagination' in data.entities) {
        const ids = entityActions.adapters.getIds(entities);

        dispatch(entityActions.setPageIds(ids));
        dispatch(entityActions.setPagination(data.entities.pagination));
      }
    }

    if ('incident' in data) {
      const incident = adaptIncident(state, data.incident.record);
      const people = getPeopleFromIncident(state, data.incident.record);

      dispatch(incidentActions.set(incident));
      dispatch(personActions.setAll(people));
    }

    if ('incidents' in data) {
      if ('first' in data.incidents) {
        const firstPeople = getPeopleFromIncident(state, data.incidents.first);

        dispatch(incidentActions.setFirst(adaptIncident(state, data.incidents.first)));
        dispatch(personActions.setAll(firstPeople));
      }

      if ('last' in data.incidents) {
        const lastPeople = getPeopleFromIncident(state, data.incidents.last);

        dispatch(incidentActions.setLast(adaptIncident(state, data.incidents.last)));
        dispatch(personActions.setAll(lastPeople));
      }

      if ('total' in data.incidents) {
        dispatch(incidentActions.setTotal(data.incidents.total));
      }

      if ('records' in data.incidents) {
        const incidents = data.incidents.records;
        const people = getPeopleFromIncidents(state, incidents);

        dispatch(incidentActions.setAll(adaptIncidents(state, incidents)));
        dispatch(personActions.setAll(people));


        if ('pagination' in data.incidents) {
          const ids = incidentActions.adapters.getIds(data.incidents.records);

          dispatch(incidentActions.setPageIds(ids));
          dispatch(incidentActions.setPagination(data.incidents.pagination));
        }
      }
    }

    if ('person' in data) {
      const person = adaptPerson(state, data.person.record);
      const incidents = personActions.adapters.getIncidents(data.person.record);
      const people = getPeopleFromIncidents(state, incidents);

      dispatch(personActions.set(person));

      if ('roles' in data.person.record) {
        if ('named' in data.person.record.roles) {
          const attendees = getAttendeesFromRole(state, data.person.record.roles.named);
          const entities = getEntitiesFromRole(state, data.person.record.roles.named);

          if (attendees.length) {
            dispatch(personActions.setAll(attendees));
          }
          if (entities.length) {
            dispatch(entityActions.setAll(entities));
          }
        }
      }

      if (incidents.length) {
        dispatch(incidentActions.setAll(adaptIncidents(state, incidents)));
      }

      if (people.length) {
        dispatch(personActions.setAll(people));
      }
    }

    if ('people' in data) {
      const people = data.people.records.map((person: PersonPayload) => adaptPerson(state, person));

      dispatch(personActions.setAll(people));

      if ('pagination' in data.people) {
        const ids = personActions.adapters.getIds(data.people.records);

        dispatch(personActions.setPageIds(ids));
        dispatch(personActions.setPagination(data.people.pagination));
      }
    }

    if ('source' in data) {
      const source = adaptSource(state, data.source.record);
      const incidents = sourceActions.adapters.getIncidents(data.source.record);
      const people = getPeopleFromIncidents(state, incidents);

      dispatch(sourceActions.set(source));

      if ('roles' in data.source.record) {
        if ('named' in data.source.record.roles) {
          const attendees = getAttendeesFromRole(state, data.source.record.roles.named);
          const entities = getEntitiesFromRole(state, data.source.record.roles.named);

          if (attendees.length) {
            dispatch(personActions.setAll(attendees));
          }
          if (entities.length) {
            dispatch(entityActions.setAll(entities));
          }
        }
      }

      if (incidents.length) {
        dispatch(incidentActions.setAll(adaptIncidents(state, incidents)));
      }

      if (people.length) {
        dispatch(personActions.setAll(people));
      }
    }

    if ('sources' in data) {
      const sources = data.sources.records.map((source: SourcePayload) => adaptSource(state, source));

      dispatch(sourceActions.setAll(sources));

      if ('pagination' in data.sources) {
        const ids = sourceActions.adapters.getIds(data.sources.records);

        dispatch(sourceActions.setPageIds(ids));
        dispatch(sourceActions.setPagination(data.sources.pagination));
      }

      if ('types' in data.sources) {
        dispatch(sourceActions.setTypes(data.sources.types));
      }
    }
  }

  if (meta) {
    if (isPrimary) {
      if ('description' in meta && meta.description) {
        dispatch(uiActions.setDescription(meta.description));
      }
      if ('pageTitle' in meta && meta.pageTitle) {
        dispatch(uiActions.setPageTitle(meta.pageTitle));
      }
      if ('section' in meta && meta.section) {
        dispatch(uiActions.setSection(meta.section));
      }
    }


    if ('errors' in meta) {
      meta.errors.forEach((error: ErrorType) => {
        dispatch(uiActions.setError(error));
      });
    }

    if ('warnings' in meta) {
      meta.warnings.forEach((warning: WarningType) => {
        dispatch(uiActions.setWarning(warning));
      });
    }
  }
};

export const handleError = (error: MaybeError) => {
  const dispatch = store.dispatch;

  dispatch(uiActions.setError(getError(error)));
};
