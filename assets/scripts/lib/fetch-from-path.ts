import { getError } from './error';
import store from './store';

import * as entityActions from '../reducers/entities';
import * as incidentActions from '../reducers/incidents';
import { actions as leaderboardActions } from '../reducers/leaderboard';
import * as personActions from '../reducers/people';
import * as sourceActions from '../reducers/sources';
import { actions as statsActions } from '../reducers/stats';
import { actions as uiActions } from '../reducers/ui';

import { RootState } from '../lib/store';
import type {
  AttendeeGroup,
  Entity,
  EntityWithIncidentRecords,
  ErrorType,
  Incident,
  Incidents,
  MetaType,
  Person,
  PersonNamedRoles,
  PersonWithIncidentRecords,
  Source,
  SourceWithIncidentRecords,
  WarningType
} from '../types';

type DataType = any;

export type Result = {
  data: DataType;
  meta?: MetaType;
  title?: string;
};

const adaptEntity = (state: RootState, entity: Entity | EntityWithIncidentRecords) =>
  entityActions.adapters.adaptOne(state, entity);
const adaptIncident = (state: RootState, incident: Incident) =>
  incidentActions.adapters.adaptOne(state, incident);
const adaptIncidents = (state: RootState, incidents: Incidents) =>
  incidents.map(incident => adaptIncident(state, incident));
const adaptPerson = (state: RootState, person: PersonWithIncidentRecords) =>
  personActions.adapters.adaptOne(state, person);
const adaptSource = (state: RootState, source: SourceWithIncidentRecords) =>
  sourceActions.adapters.adaptOne(state, source);

const getPeopleFromIncidents = (state: RootState, incidents: Incidents) =>
  incidents.flatMap((incident: Incident) =>
    Object.values(incident.attendees)
      .filter((group: AttendeeGroup) => 'records' in group)
      .map((group: AttendeeGroup) => group.records).flat()
      .map(attendee => attendee?.person)
      .map((person: PersonWithIncidentRecords) => adaptPerson(state, person))
  );

const getAttendeesFromPerson = (state: RootState, person: Person) =>
  person.attendees.roles
    .flatMap(role => role.values)
    .flatMap(value => value.records)
    .map(record => record.person)
    .map((person: PersonWithIncidentRecords) => adaptPerson(state, person));

const getEntitiesFromPerson = (state: RootState, person: Person) =>
  person.entities.roles
    .flatMap(role => role.values)
    .flatMap(value => value.records)
    .map(record => record.entity)
    .map((entity: EntityWithIncidentRecords) => adaptEntity(state, entity));

const getAttendeesFromRecord = (state: RootState, record: Entity | Source) =>
  record.attendees.values
    .flatMap(value => value.records)
    .map(entry => entry.person)
    .map((person: PersonWithIncidentRecords) => adaptPerson(state, person));

const getEntitiesFromSource = (state: RootState, source: Source) =>
  source.entities.values
    .flatMap(value => value.records)
    .map(entry => entry.entity)
    .map((entity: EntityWithIncidentRecords) => adaptEntity(state, entity));

const getAttendeesFromPersonRole = (state: RootState, roles: PersonNamedRoles) =>
  Object.values(roles)
    .map(role => role.attendees)
    .flatMap(item => item.values)
    .flatMap(item => item.records)
    .map(record => record.person)
    .map((person: PersonWithIncidentRecords) => adaptPerson(state, person));

const getEntitiesFromPersonRole = (state: RootState, roles: PersonNamedRoles) => {
  const entities = Object.values(roles).map(role => role.entities).filter(Boolean);

  if (entities.length) {
    return entities
      .flatMap(item => item.values)
      .flatMap(item => item.records)
      .map(record => record.entity)
      .map((entity: Entity) => adaptEntity(state, entity));
  }

  return [] as Entity[];
}

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

      if ('attendees' in data.entity.record) {
        const attendees = getAttendeesFromRecord(state, data.entity.record);

        if (attendees.length) {
          dispatch(personActions.setAll(attendees));
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
      const entities = data.entities.records.map((entity: EntityWithIncidentRecords) => adaptEntity(state, entity));

      dispatch(entityActions.setAll(entities));

      if ('pagination' in data.entities) {
        const ids = entityActions.adapters.getIds(entities);

        dispatch(entityActions.setPageIds(ids));
        dispatch(entityActions.setPagination(data.entities.pagination));
      }
    }

    if ('incident' in data) {
      const incident = adaptIncident(state, data.incident.record);
      const people = getPeopleFromIncidents(state, [data.incident.record]);

      dispatch(incidentActions.set(incident));
      dispatch(personActions.setAll(people));
    }

    if ('incidents' in data) {
      if ('first' in data.incidents) {
        const firstPeople = getPeopleFromIncidents(state, [data.incidents.first]);

        dispatch(incidentActions.setFirst(adaptIncident(state, data.incidents.first)));
        dispatch(personActions.setAll(firstPeople));
      }

      if ('last' in data.incidents) {
        const lastPeople = getPeopleFromIncidents(state, [data.incidents.last]);

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

      if ('entities' in data.person.record) {
        const entities = getEntitiesFromPerson(state, data.person.record);

        if (entities.length) {
          dispatch(entityActions.setAll(entities));
        }
      }

      if ('attendees' in data.person.record) {
        const attendees = getAttendeesFromPerson(state, data.person.record);

        if (attendees.length) {
          dispatch(personActions.setAll(attendees));
        }
      }

      if ('roles' in data.person.record) {
        if ('named' in data.person.record.roles) {
          const attendees = getAttendeesFromPersonRole(state, data.person.record.roles.named);
          const entities = getEntitiesFromPersonRole(state, data.person.record.roles.named);

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
      const people = data.people.records.map((person: PersonWithIncidentRecords) => adaptPerson(state, person));

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

      if ('entities' in data.source.record) {
        const entities = getEntitiesFromSource(state, data.source.record);

        if (entities.length) {
          dispatch(entityActions.setAll(entities));
        }
      }

      if ('attendees' in data.source.record) {
        const attendees = getAttendeesFromRecord(state, data.source.record);

        if (attendees.length) {
          dispatch(personActions.setAll(attendees));
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
      const sources = data.sources.records.map((source: SourceWithIncidentRecords) => adaptSource(state, source));

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
      if ('description' in meta) {
        dispatch(uiActions.setDescription(meta.description));
      }
      if ('pageTitle' in meta) {
        dispatch(uiActions.setPageTitle(meta.pageTitle));
      }
      if ('section' in meta) {
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

export const handleError = (error: unknown) => {
  const dispatch = store.dispatch;

  dispatch(uiActions.setError(getError(error)));
};
