import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import camelcaseKeys from 'camelcase-keys';

import { getSources } from '../selectors';

import { RootState } from '../lib/store';
import type {
  Ids,
  Incident,
  Incidents,
  Pagination,
  Source,
  Sources,
  SourceTypeObject,
  SourceWithIncidentRecords,
} from '../types';

export const adapter = createEntityAdapter<Source>();
export const selectors = adapter.getSelectors(getSources);

export const adapters = {
  adaptOne: (state: RootState, entry: SourceWithIncidentRecords): Source => {
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
