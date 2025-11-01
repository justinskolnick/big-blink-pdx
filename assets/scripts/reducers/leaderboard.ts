import { createAction, createReducer } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { Leaderboard, LeaderboardSet } from '../types';

const initialState = {
  filters: {},
  labels: {},
  values: {
    entities: {},
    lobbyists: {},
    officials: {},
  },
} as Leaderboard;

const setLeaderboard = createAction<Leaderboard>('api/setLeaderboard');
const setLeaderboardEntities = createAction<LeaderboardSet>('api/setLeaderboardEntities');
const setLeaderboardLobbyists = createAction<LeaderboardSet>('api/setLeaderboardLobbyists');
const setLeaderboardOfficials = createAction<LeaderboardSet>('api/setLeaderboardOfficials');

export const actions = {
  setLeaderboard,
  setLeaderboardEntities,
  setLeaderboardLobbyists,
  setLeaderboardOfficials,
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setLeaderboard, (state, action: PayloadAction<Leaderboard>) => {
      state.filters = action.payload.filters;
      state.labels = action.payload.labels;
    })
    .addCase(setLeaderboardEntities, (state, action: PayloadAction<LeaderboardSet>) => {
      state.values.entities = action.payload;
    })
    .addCase(setLeaderboardLobbyists, (state, action: PayloadAction<LeaderboardSet>) => {
      state.values.lobbyists = action.payload;
    })
    .addCase(setLeaderboardOfficials, (state, action: PayloadAction<LeaderboardSet>) => {
      state.values.officials = action.payload;
    });
});

export default reducer;
