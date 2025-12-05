import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import camelcaseKeys from 'camelcase-keys';

import { unique } from '../lib/array';

import { adaptIncidents } from './shared/adapters';
import { getPeople } from '../selectors';

import type { RootState } from '../lib/store';
import type {
  Id,
  Ids,
  Incidents,
  Pagination,
  People,
  Person,
  PersonAttendees,
  PersonEntities,
  PersonNamedRoles,
  PersonWithIncidentRecords,
} from '../types';

type InitialState = {
  pageIds: Ids;
  pagination?: Pagination;
  positionLookup: {
    completed: Ids;
    queue: Ids;
  };
};

export const adapter = createEntityAdapter<Person>();

const selectors = adapter.getSelectors(getPeople);

export const useGetPersonById = (id: Id): Person => {
  const person = useSelector((state: RootState) => selectors.selectById(state, id));

  return person;
};

export const useGetPersonPosition = (id: Id, date: string) => {
  const person = useGetPersonById(id);
  let officialPosition = null;

  if (person.officialPositions?.length) {
    officialPosition = person.officialPositions.find(position => {
      const { start, end } = position.dates;

      return start <= date && (end >= date || end === null);
    });
  }

  return officialPosition;
};

export const adapters = {
  adaptOne: (state: RootState, entry: PersonWithIncidentRecords): Person => {
    const savedEntry = selectors.selectById(state, entry.id);
    const adapted = { ...entry };

    if ('attendees' in entry) {
      adapted.attendees = {
        roles: adapted.attendees.roles.map(role => ({
          ...role,
          values: role.values.map(value => ({
            ...value,
            records: value.records.map(record => ({
              ...record,
              person: {
                id: record.person.id,
              },
            }))
          })),
        })),
      } as PersonAttendees;
    }

    if ('entities' in entry) {
      adapted.entities = {
        roles: adapted.entities.roles.map(role => ({
          ...role,
          values: role.values.map(value => ({
            ...value,
            records: value.records.map(record => ({
              ...record,
              entity: {
                id: record.entity.id,
              },
            }))
          })),
        })),
      } as PersonEntities;
    }

    if ('incidents' in entry) {
      adapted.incidents = adaptIncidents(adapted.incidents);
    }

    if ('roles' in entry) {
      adapted.roles = {
        ...savedEntry?.roles,
        ...adapted.roles,
      };

      if ('list' in entry.roles) {
        adapted.roles.list = unique([].concat(
          ...savedEntry?.roles.list ?? [],
          ...entry.roles.list,
        ));
      }

      if ('named' in entry.roles) {
        adapted.roles.named = Object.entries(entry.roles.named).reduce((all, [key, values]) => {
          all[key as keyof PersonNamedRoles] = {
            ...values,
            attendees: {
              ...values.attendees,
              values: values.attendees.values.map(value => ({
                ...value,
                records: value.records.map(record => ({
                  ...record,
                  person: {
                    id: record.person.id,
                  },
                })),
              })),
            },
            entities: {
              ...values.entities,
              values: values.entities.values.map(value => ({
                ...value,
                records: value.records.map(record => ({
                  ...record,
                  entity: {
                    id: record.entity.id,
                  }
                })),
              })),
            },
          };

          return all;
        }, {} as PersonNamedRoles);
      }
    }

    if (savedEntry && 'overview' in savedEntry) {
      adapted.overview = {
        ...savedEntry.overview,
        ...adapted.overview,
      };
    }

    return camelcaseKeys(adapted, { deep: false });
  },
  getIds: (people: People): number[] =>
    people.map((person: Person) => person.id),
  getIncidents: (person: PersonWithIncidentRecords): Incidents =>
    person.incidents?.records ?? [],
};

const initialState = {
  pageIds: [],
  pagination: null,
  positionLookup: {
    completed: [],
    queue: [],
  },
} as InitialState;

export const peopleSlice = createSlice({
  name: 'people',
  initialState: adapter.getInitialState(initialState),
  reducers: {
    set: (state, action: PayloadAction<Person>) => {
      adapter.upsertOne(state, action.payload);
    },
    setAll: (state, action: PayloadAction<People>) => {
      adapter.upsertMany(state, action.payload);
    },
    setPageIds: (state, action: PayloadAction<Ids>) => {
      state.pageIds = action.payload;
    },
    setPagination: (state, action: PayloadAction<Pagination>) => {
      state.pagination = { ...action.payload };
    },
    addToLookupCompleted: (state, action: PayloadAction<Id>) => {
      state.positionLookup.queue = state.positionLookup.queue.filter(id => id !== action.payload);
      state.positionLookup.completed.push(action.payload);
    },
    addToLookupQueue: (state, action: PayloadAction<Ids>) => {
      state.positionLookup.queue = unique([].concat(state.positionLookup.queue, action.payload));
    },
  },
});

export const {
  addToLookupCompleted,
  addToLookupQueue,
  set,
  setAll,
  setPageIds,
  setPagination,
} = peopleSlice.actions;

export default peopleSlice.reducer;
