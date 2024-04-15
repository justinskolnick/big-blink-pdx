import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import camelcaseKeys from 'camelcase-keys';

import { getSources } from '../selectors';
import type {
  Ids,
  Incident,
  Incidents,
  Pagination,
  Source,
  Sources,
  SourceWithIncidentRecords,
} from '../types';

export const adapters = {
  adaptOne: (source: SourceWithIncidentRecords): any => {
    if (source.incidents) {
      const {
        filters,
        pagination,
        records,
        stats,
      } = source.incidents;
      const ids = records ? { ids: records.map((record: Incident) => record.id) } : undefined;

      return {
        ...camelcaseKeys(source, { deep: false }),
        incidents: {
          filters,
          pagination,
          stats,
          ...ids,
        },
      };
    }

    return source;
  },
  getIds: (sources: Sources): Ids =>
    sources.map((source: Source) => source.id),
  getIncidents: (source: SourceWithIncidentRecords): Incidents =>
    source.incidents?.records ?? [],
};

export const adapter = createEntityAdapter<Source>();

export const selectors = adapter.getSelectors(getSources);

export const sourcesSlice = createSlice({
  name: 'sources',
  initialState: adapter.getInitialState({
    pageIds: [],
    pagination: null,
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
  },
});

export const { set, setAll, setPageIds, setPagination } = sourcesSlice.actions;

export default sourcesSlice.reducer;
