import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { getPeople } from '../selectors';
import type {
  Ids,
  Incident,
  Incidents,
  LeaderboardSet,
  Pagination,
  People,
  Person,
  PersonWithIncidentRecords,
} from '../types';

type Leaderboard = {
  lobbyists: LeaderboardSet;
  officials: LeaderboardSet;
};

type InitialState = {
  leaderboard: Leaderboard;
  pageIds: Ids;
  pagination?: Pagination;
};

export const adapters = {
  adaptOne: (person: PersonWithIncidentRecords): any => {
    if (person.incidents) {
      const {
        filters,
        pagination,
        records,
        stats,
      } = person.incidents;
      const ids = records ? { ids: records.map((record: Incident) => record.id) } : undefined;

      return {
        ...person,
        incidents: {
          filters,
          pagination,
          stats,
          ...ids,
        },
      };
    }

    return person;
  },
  getIds: (people: People): number[] =>
    people.map((person: Person) => person.id),
  getIncidents: (person: PersonWithIncidentRecords): Incidents =>
    person.incidents?.records ?? [],
};

export const adapter = createEntityAdapter<Person>();

export const selectors = adapter.getSelectors(getPeople);

const leaderboardSet = {
  ids: [] as Ids,
  labels: {
    links: {
      more: '',
    },
    subtitle: '',
    table: {
      title: '',
    },
    title: '',
  },
};

const initialState = {
  leaderboard: {
    lobbyists: leaderboardSet,
    officials: leaderboardSet,
  },
  pageIds: [],
  pagination: null,
} as InitialState;

export const peopleSlice = createSlice({
  name: 'people',
  initialState: adapter.getInitialState(initialState),
  reducers: {
    set: (state, action: PayloadAction<Person>) => {
      adapter.upsertOne(state, action.payload);
    },
    setAll: (state, action: PayloadAction<People>) => {
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
} = peopleSlice.actions;

export default peopleSlice.reducer;
