import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { getIncidents } from '../selectors';
import type {
  Ids,
  Incident,
  Incidents,
  Pagination,
} from '../types';

export const adapters = {
  adaptOne: (incident: Incident): Incident =>
    incident,
  getIds: (people: Incidents): Ids =>
    people.map((incident: Incident) => incident.id),
};

export const adapter = createEntityAdapter<Incident>();

export const selectors = adapter.getSelectors(getIncidents);

export const incidentsSlice = createSlice({
  name: 'incidents',
  initialState: adapter.getInitialState({
    pageIds: [],
    pagination: null,
    first: null,
    last: null,
    total: 0,
  }),
  reducers: {
    set: (state, action: PayloadAction<Incident>) => {
      adapter.upsertOne(state, action.payload);
    },
    setAll: (state, action: PayloadAction<Incidents>) => {
      adapter.upsertMany(state, action.payload);
    },
    setPageIds: (state, action: PayloadAction<Ids>) => {
      state.pageIds = action.payload;
    },
    setPagination: (state, action: PayloadAction<Pagination>) => {
      state.pagination = { ...action.payload };
    },
    setFirst(state, action: PayloadAction<Incident>) {
      state.first = action.payload;
      adapter.upsertOne(state, action.payload);
    },
    setLast(state, action: PayloadAction<Incident>) {
      state.last = action.payload;
      adapter.upsertOne(state, action.payload);
    },
    setTotal(state, action: PayloadAction<number>) {
      state.total = action.payload;
    },
  },
});

export const {
  set,
  setAll,
  setFirst,
  setLast,
  setPageIds,
  setPagination,
  setTotal,
} = incidentsSlice.actions;

export default incidentsSlice.reducer;
