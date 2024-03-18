import { getError } from './error';
import { get } from './request';
import store from './store';

import * as entityActions from '../reducers/entities';
import * as incidentActions from '../reducers/incidents';
import * as personActions from '../reducers/people';
import * as sourceActions from '../reducers/sources';
import { actions as statsActions } from '../reducers/stats';
import { actions as uiActions } from '../reducers/ui';

import type { AttendeeGroup, ErrorType, Incident, Incidents, Person, Source, WarningType } from '../types';

type Result = {
  data: any;
  meta: any;
};

const getPeopleFromIncidents = (incidents: Incidents) =>
  incidents.flatMap((incident: Incident) =>
    Object.values(incident.attendees)
      .map((group: AttendeeGroup) => group.records).flat()
      .map(attendee => attendee.person)
  );

const getEntitiesFromPerson = (person: Person) =>
  person?.entities ? Object.values(person.entities).flat().map(entry => entry.entity) : [];

const getEntitiesFromSource = (source: Source) =>
  source?.entities ? source.entities.flat().map(entry => entry.entity) : [];

const handleResult = (result: Result, isPrimary: boolean) => {
  const dispatch = store.dispatch;
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

    if ('entity' in data) {
      const entity = entityActions.adapters.adaptOne(data.entity.record);
      const incidents = entityActions.adapters.getIncidents(data.entity.record);
      const people = getPeopleFromIncidents(incidents);

      dispatch(entityActions.set(entity));
      dispatch(incidentActions.setAll(incidents));
      dispatch(personActions.setAll(people));
    }

    if ('entities' in data) {
      dispatch(entityActions.setAll(data.entities.records));

      if ('pagination' in data.entities) {
        const ids = entityActions.adapters.getIds(data.entities.records);

        dispatch(entityActions.setPageIds(ids));
        dispatch(entityActions.setPagination(data.entities.pagination));
      }

      if ('leaderboard' in data.entities) {
        dispatch(entityActions.setLeaderboard(data.entities.leaderboard));
      }
    }

    if ('incident' in data) {
      const incident = incidentActions.adapters.adaptOne(data.incident.record);
      const people = getPeopleFromIncidents([incident]);

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
      const person = personActions.adapters.adaptOne(data.person.record);
      const incidents = personActions.adapters.getIncidents(data.person.record);
      const people = getPeopleFromIncidents(incidents);
      const entities = getEntitiesFromPerson(person);

      dispatch(personActions.set(person));
      dispatch(incidentActions.setAll(incidents));
      dispatch(personActions.setAll(people));
      dispatch(entityActions.setAll(entities));
    }

    if ('people' in data) {
      dispatch(personActions.setAll(data.people.records));

      if ('pagination' in data.people) {
        const ids = personActions.adapters.getIds(data.people.records);

        dispatch(personActions.setPageIds(ids));
        dispatch(personActions.setPagination(data.people.pagination));
      }

      if ('leaderboard' in data.people) {
        dispatch(personActions.setLeaderboard(data.people.leaderboard));
      }
    }

    if ('source' in data) {
      const source = sourceActions.adapters.adaptOne(data.source.record);
      const incidents = sourceActions.adapters.getIncidents(data.source.record);
      const people = getPeopleFromIncidents(incidents);
      const entities = getEntitiesFromSource(data.source.record);

      dispatch(sourceActions.set(source));
      dispatch(incidentActions.setAll(incidents));
      dispatch(personActions.setAll(people));
      dispatch(entityActions.setAll(entities));
    }

    if ('sources' in data) {
      dispatch(sourceActions.setAll(data.sources.records));

      if ('pagination' in data.sources) {
        const ids = sourceActions.adapters.getIds(data.sources.records);

        dispatch(sourceActions.setPageIds(ids));
        dispatch(sourceActions.setPagination(data.sources.pagination));
      }
    }
  }

  if (meta) {
    if (isPrimary) {
      if ('description' in meta) {
        dispatch(uiActions.setDescription(meta.description));
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

const handleError = (error: unknown) => {
  const dispatch = store.dispatch;

  dispatch(uiActions.setError(getError(error)));
};

const fetchFromPath = (path: string, isPrimary: boolean = false) => {
  const url = new URL(path, window.location.toString());
  const endpoint = url.pathname + url.search;

  return get(endpoint)
    .then((result) => handleResult(result, isPrimary))
    .catch(handleError);
};

export default fetchFromPath;
