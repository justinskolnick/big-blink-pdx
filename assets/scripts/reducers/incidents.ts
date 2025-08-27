import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import { adaptAttendeeRecords } from './shared/adapters';

import { getIncidents } from '../selectors';

import type { RootState } from '../lib/store';
import type {
  AttendeeGroup,
  Id,
  Ids,
  Incident,
  IncidentAttendees,
  Incidents,
  Pagination,
} from '../types';

type AttendeesTuple = [
  key: keyof IncidentAttendees,
  value: AttendeeGroup
];

const adaptAttendees = (attendees: IncidentAttendees) =>
  Object.entries(attendees).reduce((all, [key, value]: AttendeesTuple) => {
    all[key] = {
      ...value,
      records: adaptAttendeeRecords(value.records),
    };

    return all;
  }, {} as IncidentAttendees);

export const adapters = {
  adaptOne: (state: RootState, entry: Incident): Incident => {
    const adapted = { ...entry };

    if ('attendees' in entry) {
      adapted.attendees = adaptAttendees(adapted.attendees);
    }

    return adapted;
  },
  getIds: (people: Incidents): Ids =>
    people.map((incident: Incident) => incident.id),
};

export const adapter = createEntityAdapter<Incident>();

const selectors = adapter.getSelectors(getIncidents);
export const useGetIncidentById = (id: Id): Incident => {
  const entity = useSelector((state: RootState) => selectors.selectById(state, id));

  return entity;
};

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
