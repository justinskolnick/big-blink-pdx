import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import camelcaseKeys from 'camelcase-keys';

import { adaptIncidents, adaptRoles } from './shared/adapters';
import { getEntities } from '../selectors';

import type { RootState } from '../lib/store';
import type {
  Entities,
  Entity,
  EntityWithIncidentRecords,
  Id,
  Ids,
  Incidents,
  Pagination,
} from '../types';

type InitialState = {
  pageIds: Ids;
  pagination?: Pagination;
};

const adapter = createEntityAdapter<Entity>();

const selectors = adapter.getSelectors(getEntities);
export const useGetEntityById = (id: Id): Entity => {
  const entity = useSelector((state: RootState) => selectors.selectById(state, id));

  return entity;
};

export const adapters = {
  adaptOne: (state: RootState, entry: Entity | EntityWithIncidentRecords): Entity => {
    const savedEntry = selectors.selectById(state, entry.id);
    const adapted = { ...entry };

    if ('incidents' in adapted) {
      adapted.incidents = adaptIncidents(adapted.incidents);
    }

    if ('roles' in entry) {
      adapted.roles = adaptRoles(entry.roles, savedEntry?.roles);
    }

    if (savedEntry && 'overview' in savedEntry) {
      adapted.overview = {
        ...savedEntry.overview,
        ...adapted.overview,
      };
    }

    return camelcaseKeys(adapted, { deep: false });
  },
  getIds: (entities: Entities): Ids =>
    entities.map((entity: Entity) => entity.id),
  getIncidents: (entity: EntityWithIncidentRecords): Incidents =>
    entity.incidents?.records ?? [],
};

const initialState = {
  pageIds: [],
  pagination: null,
} as InitialState;

export const entitiesSlice = createSlice({
  name: 'entities',
  initialState: adapter.getInitialState(initialState),
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
  },
});

export const {
  set,
  setAll,
  setPageIds,
  setPagination,
} = entitiesSlice.actions;

export default entitiesSlice.reducer;
