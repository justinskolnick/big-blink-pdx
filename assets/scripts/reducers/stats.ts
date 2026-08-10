import { createAction, createReducer } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type {
  GenericObject,
  Stats,
  StatsObject,
} from '../types';

const setHome = createAction<StatsObject>('stats/setHome');
const setLabels = createAction<GenericObject>('stats/setLabels');
const setSources = createAction<Stats>('stats/setSources');

export const actions = {
  setHome,
  setLabels,
  setSources,
};

interface InitialState {
  home?: StatsObject;
  labels: GenericObject;
  sources: Stats;
}

const initialState: InitialState = {
  home: undefined,
  labels: {},
  sources: [],
};

const statsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setHome, (state, action: PayloadAction<StatsObject>) => {
      state.home = action.payload;
    })
    .addCase(setLabels, (state, action: PayloadAction<GenericObject>) => {
      state.labels = action.payload;
    })
    .addCase(setSources, (state, action: PayloadAction<Stats>) => {
      state.sources = action.payload;
    });
});

export default statsReducer;
