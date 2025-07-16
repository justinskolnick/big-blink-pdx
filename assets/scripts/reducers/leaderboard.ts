import { createAction, createReducer } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { Leaderboard } from '../types';

const initialState = {
  filters: {},
  labels: {},
  values: {},
} as Leaderboard;

const setLeaderboard = createAction<Leaderboard>('ui/setLeaderboard');

export const actions = {
  setLeaderboard,
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setLeaderboard, (state, action: PayloadAction<Leaderboard>) => {
      state.filters = action.payload.filters;
      state.labels = action.payload.labels;
      state.values = action.payload.values;
    });
});

export default reducer;
