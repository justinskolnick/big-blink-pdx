import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { getEntities } from '../selectors';
import type {
  Entities,
  Entity,
  EntityWithIncidentRecords,
  Ids,
  Incident,
  Incidents,
  Pagination,
} from '../types';

type Leaderboard = {
  all: Ids;
};

export const adapters = {
  adaptOne: (entity: EntityWithIncidentRecords): any => {
    if (entity.incidents) {
      const {
        filters,
        pagination,
        records,
        stats,
      } = entity.incidents;
      const ids = records ? { ids: records.map((record: Incident) => record.id) } : undefined;

      return {
        ...entity,
        incidents: {
          filters,
          pagination,
          stats,
          ...ids,
        },
      };
    }

    return entity;
  },
  getIds: (entities: Entities): Ids =>
    entities.map((entity: Entity) => entity.id),
  getIncidents: (entity: EntityWithIncidentRecords): Incidents =>
    entity.incidents?.records ?? [],
};

const adapter = createEntityAdapter<Entity>();

export const selectors = adapter.getSelectors(getEntities);

export const entitiesSlice = createSlice({
  name: 'entities',
  initialState: adapter.getInitialState({
    leaderboard: {
      all: [],
    },
    pageIds: [],
    pagination: null,
  }),
  reducers: {
    set: (state, action: PayloadAction<Entity>) => {
      adapter.upsertOne(state, action.payload);
    },
    setAll: (state, action: PayloadAction<Entities>) => {
      adapter.upsertMany(state, action.payload);
    },
    setPageIds: (state, action: PayloadAction<Ids>) => {
      state.pageIds = action.payload;
    },
    setPagination: (state, action: PayloadAction<Pagination>) => {
      state.pagination = { ...action.payload };
    },
    setLeaderboard: (state, action: PayloadAction<Leaderboard>) => {
      state.leaderboard = action.payload;
    },
  },
});

export const {
  set,
  setAll,
  setLeaderboard,
  setPageIds,
  setPagination,
} = entitiesSlice.actions;

export default entitiesSlice.reducer;
