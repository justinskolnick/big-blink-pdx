import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import camelcaseKeys from 'camelcase-keys';

import { unique } from '../lib/array';

import { adaptIncidents, adaptRoles } from './shared/adapters';
import { getPeople } from '../selectors';

import type { RootState } from '../lib/store';
import type {
  Id,
  Ids,
  Incidents,
  ItemOverview,
  Pagination,
  PersonObject,
  PersonPayload,
} from '../types';

interface InitialState {
  pageIds: Ids;
  pagination?: Pagination;
  positionLookup: Record<'completed' | 'queue', Ids>;
}

export const adapter = createEntityAdapter<PersonObject>();

const selectors = adapter.getSelectors(getPeople);

export const useGetPersonById = (id: Id): PersonObject => {
  const person = useSelector((state: RootState) => selectors.selectById(state, id));

  return person;
};

export const useGetPersonPosition = (id: Id, date: string) => {
  const person = useGetPersonById(id);
  let officialPosition = null;

  if (person.officialPositions?.length) {
    officialPosition = person.officialPositions.find(position => {
      const { start, end } = position.dates;

      return start <= date && (end >= date || end === null);
    });
  }

  return officialPosition;
};

export const adapters = {
  adaptOne: (state: RootState, entry: PersonPayload): PersonObject => {
    const savedEntry = selectors.selectById(state, entry.id);
    const { incidents, ...rest } = entry;
    const adapted = { ...rest } as PersonObject;

    if ('incidents' in entry && incidents) {
      adapted.incidents = adaptIncidents(incidents);
    }

    if (savedEntry && 'overview' in savedEntry) {
      adapted.overview = {
        ...savedEntry.overview,
        ...adapted.overview,
      } as ItemOverview;
    }

    if ('roles' in entry && entry.roles) {
      adapted.roles = adaptRoles(entry.roles, savedEntry?.roles);
    }

    return camelcaseKeys(adapted, { deep: false });
  },
  getIds: (values: PersonPayload[]): Ids =>
    values.map((value: PersonPayload) => value.id),
  getIncidents: (value: PersonPayload): Incidents =>
    value.incidents?.records ?? [],
};

const initialState: InitialState = {
  pageIds: [],
  pagination: undefined,
  positionLookup: {
    completed: [],
    queue: [],
  },
};

export const peopleSlice = createSlice({
  name: 'people',
  initialState: adapter.getInitialState(initialState),
  reducers: {
    set: (state, action: PayloadAction<PersonObject>) => {
      adapter.upsertOne(state, action.payload);
    },
    setAll: (state, action: PayloadAction<PersonObject[]>) => {
      adapter.upsertMany(state, action.payload);
    },
    setPageIds: (state, action: PayloadAction<Ids>) => {
      state.pageIds = action.payload;
    },
    setPagination: (state, action: PayloadAction<Pagination>) => {
      state.pagination = { ...action.payload };
    },
    addToLookupCompleted: (state, action: PayloadAction<Id>) => {
      state.positionLookup.queue = state.positionLookup.queue.filter(id => id !== action.payload);
      state.positionLookup.completed.push(action.payload);
    },
    addToLookupQueue: (state, action: PayloadAction<Ids>) => {
      state.positionLookup.queue = unique([...state.positionLookup.queue, ...action.payload]);
    },
  },
});

export const {
  addToLookupCompleted,
  addToLookupQueue,
  set,
  setAll,
  setPageIds,
  setPagination,
} = peopleSlice.actions;

export default peopleSlice.reducer;
