import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import camelcaseKeys from 'camelcase-keys';

import {
  adaptIncidents,
  adaptRoles,
} from './shared/adapters';
import { getSources } from '../selectors';

import useSelector from '../hooks/use-app-selector';

import { RootState } from '../lib/store';
import type {
  Id,
  Ids,
  IncidentPayload,
  Pagination,
  SourceObject,
  SourceObjectRoles,
  SourcePayload,
  SourceTypeObject,
} from '../types';

interface InitialState {
  pageIds: Ids | [];
  pagination?: Pagination;
  types: SourceTypeObject | object;
}

export const adapter = createEntityAdapter<SourceObject>();

const selectors = adapter.getSelectors(getSources);
export const useGetSourceById = (id: Id): SourceObject => {
  const entity = useSelector((state: RootState) => selectors.selectById(state, id));

  return entity;
};

export const adapters = {
  adaptOne: (state: RootState, entry: SourcePayload): SourceObject => {
    const savedEntry = selectors.selectById(state, entry.id);
    const { incidents, overview, roles, ...rest } = entry;
    const adapted: SourceObject = { ...rest };

    if ('incidents' in entry && incidents) {
      adapted.incidents = adaptIncidents(incidents);
    }

    if ('overview' in entry && overview) {
      adapted.overview = {
        ...savedEntry?.overview,
        ...overview,
      };
    }

    if ('roles' in entry && roles) {
      adapted.roles = adaptRoles<SourceObjectRoles>(roles, savedEntry?.roles);
    }

    return camelcaseKeys(adapted, { deep: false });
  },
  getIds: (values: SourcePayload[]): Ids =>
    values.map((value: SourcePayload) => value.id),
  getIncidents: (value: SourcePayload): IncidentPayload[] =>
    value.incidents?.records ?? [],
};

const initialState: InitialState = {
  pageIds: [],
  pagination: undefined,
  types: {},
};

export const sourcesSlice = createSlice({
  name: 'sources',
  initialState: adapter.getInitialState(initialState),
  reducers: {
    set: (state, action: PayloadAction<SourceObject>) => {
      adapter.upsertOne(state, action.payload);
    },
    setAll: (state, action: PayloadAction<SourceObject[]>) => {
      adapter.upsertMany(state, action.payload);
    },
    setPageIds: (state, action: PayloadAction<Ids>) => {
      state.pageIds = action.payload;
    },
    setPagination: (state, action: PayloadAction<Pagination>) => {
      state.pagination = { ...action.payload };
    },
    setTypes: (state, action: PayloadAction<SourceTypeObject>) => {
      state.types = action.payload;
    },
  },
});

export const { set, setAll, setPageIds, setPagination, setTypes } = sourcesSlice.actions;

export default sourcesSlice.reducer;
