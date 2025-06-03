import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import camelcaseKeys from 'camelcase-keys';

import { getPeople } from '../selectors';

import { RootState } from '../lib/store';
import type {
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
};

export const adapter = createEntityAdapter<Person>();
export const selectors = adapter.getSelectors(getPeople);

export const adapters = {
  adaptOne: (state: RootState, entry: PersonWithIncidentRecords): Person => {
    const savedEntry = selectors.selectById(state, entry.id);

    if ('incidents' in entry) {
      const {
        filters,
        pagination,
        records,
        stats,
      } = entry.incidents;
      const ids = records ? { ids: records.map((record: Incident) => record.id) } : undefined;

      entry.incidents = {
        filters,
        pagination,
        stats,
        ...ids,
      };
    }

    if (savedEntry && 'overview' in savedEntry) {
      entry.overview = {
        ...savedEntry.overview,
        ...entry.overview,
      };
    }

    return camelcaseKeys(entry, { deep: false });
  },
  getIds: (people: People): number[] =>
    people.map((person: Person) => person.id),
  getIncidents: (person: PersonWithIncidentRecords): Incidents =>
    person.incidents?.records ?? [],
};

const initialState = {
  pageIds: [],
  pagination: null,
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
  },
});

export const {
  set,
  setAll,
  setPageIds,
  setPagination,
} = peopleSlice.actions;

export default peopleSlice.reducer;
