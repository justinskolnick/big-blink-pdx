import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import camelcaseKeys from 'camelcase-keys';

import {
  adaptAttendees,
  adaptIncidents,
} from './shared/adapters';
import { getSources } from '../selectors';

import { RootState } from '../lib/store';
import type {
  Id,
  Ids,
  Incidents,
  Pagination,
  Source,
  SourceEntities,
  Sources,
  SourceTypeObject,
  SourceWithIncidentRecords,
} from '../types';

export const adapter = createEntityAdapter<Source>();

const selectors = adapter.getSelectors(getSources);
export const useGetSourceById = (id: Id): Source => {
  const entity = useSelector((state: RootState) => selectors.selectById(state, id));

  return entity;
};

export const adapters = {
  adaptOne: (state: RootState, entry: SourceWithIncidentRecords): Source => {
    const savedEntry = selectors.selectById(state, entry.id);
    const adapted = { ...entry };

    if ('attendees' in entry) {
      adapted.attendees = adaptAttendees(adapted.attendees);
    }

    if ('entities' in entry) {
      adapted.entities = {
        ...adapted.entities,
        values: adapted.entities.values.map(value => ({
          ...value,
          records: value.records.map(record => ({
            ...record,
            entity: {
              id: record.entity.id,
            },
          }))
        })),
      } as SourceEntities;
    }

    if ('incidents' in adapted) {
      adapted.incidents = adaptIncidents(adapted.incidents);
    }

    if (savedEntry && 'overview' in savedEntry) {
      adapted.overview = {
        ...savedEntry.overview,
        ...adapted.overview,
      };
    }

    return camelcaseKeys(adapted, { deep: false });
  },
  getIds: (sources: Sources): Ids =>
    sources.map((source: Source) => source.id),
  getIncidents: (source: SourceWithIncidentRecords): Incidents =>
    source.incidents?.records ?? [],
};

export const sourcesSlice = createSlice({
  name: 'sources',
  initialState: adapter.getInitialState({
    pageIds: [],
    pagination: null,
    types: {} as SourceTypeObject,
  }),
  reducers: {
    set: (state, action: PayloadAction<Source>) => {
      adapter.upsertOne(state, action.payload);
    },
    setAll: (state, action: PayloadAction<Sources>) => {
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
