import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import camelcaseKeys from 'camelcase-keys';

import { adaptIncidents, adaptRoles } from './shared/adapters';
import { getEntities } from '../selectors';

import useSelector from '../hooks/use-app-selector';

import type { RootState } from '../lib/store';
import type {
  EntityObject,
  EntityObjectRoles,
  EntityPayload,
  EntityPayloadRoles,
  Id,
  Ids,
  IncidentPayload,
  Pagination,
} from '../types';

interface InitialState {
  pageIds: Ids;
  pagination?: Pagination;
}

const adapter = createEntityAdapter<EntityObject>();

const selectors = adapter.getSelectors(getEntities);
export const useGetEntityById = (id: Id): EntityObject => {
  const entity = useSelector((state: RootState) => selectors.selectById(state, id));

  return entity;
};

export const adapters = {
  adaptOne: (state: RootState, entry: EntityPayload): EntityObject => {
    const savedEntry = selectors.selectById(state, entry.id);
    const { incidents, overview, roles, ...rest } = entry;
    const adapted: EntityObject = { ...rest };

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
      adapted.roles = adaptRoles<EntityPayloadRoles, EntityObjectRoles>(roles, savedEntry?.roles);
    }

    return camelcaseKeys(adapted, { deep: false });
  },
  getIds: (entities: EntityObject[]): Ids =>
    entities.map((entity: EntityObject) => entity.id),
  getIncidents: (entity: EntityPayload): IncidentPayload[] =>
    entity.incidents?.records ?? [],
};

const initialState: InitialState = {
  pageIds: [],
  pagination: undefined,
};

export const entitiesSlice = createSlice({
  name: 'entities',
  initialState: adapter.getInitialState(initialState),
  reducers: {
    set: (state, action: PayloadAction<EntityObject>) => {
      adapter.upsertOne(state, action.payload);
    },
    setAll: (state, action: PayloadAction<EntityObject[]>) => {
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
