import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import camelcaseKeys from 'camelcase-keys';

import { getPeople } from '../selectors';

import { unique } from '../lib/array';
import type { RootState } from '../lib/store';
import type {
  Id,
  Ids,
  Incident,
  Incidents,
  Pagination,
  People,
  Person,
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
export const selectors = adapter.getSelectors(getPeople);

export const adapters = {
  adaptOne: (state: RootState, entry: PersonWithIncidentRecords): Person => {
    const savedEntry = selectors.selectById(state, entry.id);
    const adapted = { ...entry };

    if ('incidents' in adapted) {
      const {
        filters,
        pagination,
        records,
        stats,
      } = adapted.incidents;
      const ids = records ? { ids: records.map((record: Incident) => record.id) } : undefined;

      adapted.incidents = {
        filters,
        pagination,
        stats,
        ...ids,
      };
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
