import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import { adaptAttendeeRecords } from './shared/adapters';

import { getIncidents } from '../selectors';

import type { RootState } from '../lib/store';
import type {
  Id,
  Ids,
  IncidentObject,
  IncidentObjectAttendeeGroup,
  IncidentObjectAttendees,
  IncidentPayload,
  IncidentPayloadAttendees,
  Pagination,
} from '../types';

interface InitialState {
  pageIds: Ids;
  pagination?: Pagination;
  first?: IncidentObject;
  last?: IncidentObject;
  total: number;
}

const adaptAttendees = (attendees: IncidentPayloadAttendees): IncidentObjectAttendees =>
  Object.entries(attendees).reduce((all, [k, value]) => {
    const key = k as keyof typeof attendees;

    all[key] = {
      ...value,
      records: adaptAttendeeRecords(value.records),
    } as IncidentObjectAttendeeGroup;

    return all;
  }, {} as IncidentObjectAttendees);

export const adapters = {
  adaptOne: (state: RootState, entry: IncidentPayload): IncidentObject => {
    const { attendees, ...rest } = entry;
    const adapted = { ...rest } as IncidentObject;

    if ('attendees' in entry && attendees) {
      adapted.attendees = adaptAttendees(attendees);
    }

    return adapted;
  },
  getIds: (incidents: IncidentPayload[]): Ids =>
    incidents.map((incident: IncidentPayload) => incident.id),
};

export const adapter = createEntityAdapter<IncidentObject>();

const selectors = adapter.getSelectors(getIncidents);
export const useGetIncidentById = (id: Id): IncidentObject => {
  const entity = useSelector((state: RootState) => selectors.selectById(state, id));

  return entity;
};

const initialState: InitialState = {
  pageIds: [],
  pagination: undefined,
  first: undefined,
  last: undefined,
  total: 0,
};

export const incidentsSlice = createSlice({
  name: 'incidents',
  initialState: adapter.getInitialState(initialState),
  reducers: {
    set: (state, action: PayloadAction<IncidentObject>) => {
      adapter.upsertOne(state, action.payload);
    },
    setAll: (state, action: PayloadAction<IncidentObject[]>) => {
      adapter.upsertMany(state, action.payload);
    },
    setPageIds: (state, action: PayloadAction<Ids>) => {
      state.pageIds = action.payload;
    },
    setPagination: (state, action: PayloadAction<Pagination>) => {
      state.pagination = { ...action.payload };
    },
    setFirst(state, action: PayloadAction<IncidentObject>) {
      state.first = action.payload;
      adapter.upsertOne(state, action.payload);
    },
    setLast(state, action: PayloadAction<IncidentObject>) {
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
