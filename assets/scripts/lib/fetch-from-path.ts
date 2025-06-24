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
  EntityWithIncidentRecords,
  ErrorType,
  Incident,
  Incidents,
  MetaType,
  Person,
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

const getPeopleFromIncidents = (state: RootState, incidents: Incidents) =>
  incidents.flatMap((incident: Incident) =>
    Object.values(incident.attendees)
      .filter((group: AttendeeGroup) => 'records' in group)
      .map((group: AttendeeGroup) => group.records).flat()
      .map(attendee => attendee?.person)
      .map((person: PersonWithIncidentRecords) => personActions.adapters.adaptOne(state, person))
  );

const getEntitiesFromPerson = (state: RootState, person: Person) => {
  if (person?.entities) {
    return person.entities.roles
      .flatMap(role => role.values)
      .flatMap(value => value.records)
      .map(record => record.entity)
      .map((entity: EntityWithIncidentRecords) => entityActions.adapters.adaptOne(state, entity));
  }

  return [];
};

const getEntitiesFromSource = (state: RootState, source: Source) => {
  if (source?.entities) {
    return source.entities.values
      .flatMap(value => value.records)
      .map(entry => entry.entity)
      .map((entity: EntityWithIncidentRecords) => entityActions.adapters.adaptOne(state, entity));
  }

  return [];
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
      dispatch(leaderboardActions.setLeaderboard(data.leaderboard));
    }

    if ('entity' in data) {
      const entity = entityActions.adapters.adaptOne(state, data.entity.record);
      const incidents = entityActions.adapters.getIncidents(data.entity.record);
      const people = getPeopleFromIncidents(state, incidents);

      dispatch(entityActions.set(entity));
      dispatch(incidentActions.setAll(incidents));
      dispatch(personActions.setAll(people));
    }

    if ('entities' in data) {
      const entities = data.entities.records.map((entity: EntityWithIncidentRecords) => entityActions.adapters.adaptOne(state, entity));

      dispatch(entityActions.setAll(entities));

      if ('pagination' in data.entities) {
        const ids = entityActions.adapters.getIds(entities);

        dispatch(entityActions.setPageIds(ids));
        dispatch(entityActions.setPagination(data.entities.pagination));
      }
    }

    if ('incident' in data) {
      const incident = incidentActions.adapters.adaptOne(data.incident.record);
      const people = getPeopleFromIncidents(state, [incident]);

      dispatch(incidentActions.set(incident));
      dispatch(personActions.setAll(people));
    }

    if ('incidents' in data) {
      if ('first' in data.incidents) {
        dispatch(incidentActions.setFirst(data.incidents.first));
      }

      if ('last' in data.incidents) {
        dispatch(incidentActions.setLast(data.incidents.last));
      }

      if ('total' in data.incidents) {
        dispatch(incidentActions.setTotal(data.incidents.total));
      }

      if ('records' in data.incidents) {
        dispatch(incidentActions.setAll(data.incidents.records));

        if ('pagination' in data.incidents) {
          const ids = incidentActions.adapters.getIds(data.incidents.records);

          dispatch(incidentActions.setPageIds(ids));
          dispatch(incidentActions.setPagination(data.incidents.pagination));
        }
      }
    }

    if ('person' in data) {
      const person = personActions.adapters.adaptOne(state, data.person.record);
      const incidents = personActions.adapters.getIncidents(data.person.record);
      const people = getPeopleFromIncidents(state, incidents);
      const entities = getEntitiesFromPerson(state, person);

      dispatch(personActions.set(person));
      dispatch(incidentActions.setAll(incidents));
      dispatch(personActions.setAll(people));
      dispatch(entityActions.setAll(entities));
    }

    if ('people' in data) {
      const people = data.people.records.map((person: PersonWithIncidentRecords) => personActions.adapters.adaptOne(state, person));

      dispatch(personActions.setAll(people));

      if ('pagination' in data.people) {
        const ids = personActions.adapters.getIds(data.people.records);

        dispatch(personActions.setPageIds(ids));
        dispatch(personActions.setPagination(data.people.pagination));
      }
    }

    if ('source' in data) {
      const source = sourceActions.adapters.adaptOne(state, data.source.record);
      const incidents = sourceActions.adapters.getIncidents(data.source.record);
      const people = getPeopleFromIncidents(state, incidents);
      const entities = getEntitiesFromSource(state, data.source.record);

      dispatch(sourceActions.set(source));
      dispatch(incidentActions.setAll(incidents));
      dispatch(personActions.setAll(people));
      dispatch(entityActions.setAll(entities));
    }

    if ('sources' in data) {
      const sources = data.sources.records.map((source: SourceWithIncidentRecords) => sourceActions.adapters.adaptOne(state, source));

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
