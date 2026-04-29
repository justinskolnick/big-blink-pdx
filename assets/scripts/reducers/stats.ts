import { createAction, createReducer } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type {
  GenericObject,
  Stats,
  StatsObject,
  StatsObjectWithId,
} from '../types';

const setEntity = createAction<StatsObjectWithId>('stats/setEntity');
const setHome = createAction<StatsObject>('stats/setHome');
const setLabels = createAction<GenericObject>('stats/setLabels');
const setPerson = createAction<StatsObjectWithId>('stats/setPerson');
const setSources = createAction<Stats>('stats/setSources');

export const actions = {
  setEntity,
  setHome,
  setLabels,
  setPerson,
  setSources,
};

interface InitialState {
  entities: StatsObjectWithId[];
  home?: StatsObject;
  labels: GenericObject;
  people: StatsObjectWithId[];
  sources: Stats;
}

const initialState: InitialState = {
  entities: [],
  home: undefined,
  labels: {},
  people: [],
  sources: [],
};

const statsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setEntity, (state, action: PayloadAction<StatsObjectWithId>) => {
      state.entities.push(action.payload);
    })
    .addCase(setHome, (state, action: PayloadAction<StatsObject>) => {
      state.home = action.payload;
    })
    .addCase(setLabels, (state, action: PayloadAction<GenericObject>) => {
      state.labels = action.payload;
    })
    .addCase(setPerson, (state, action: PayloadAction<StatsObjectWithId>) => {
      state.people.push(action.payload);
    })
    .addCase(setSources, (state, action: PayloadAction<Stats>) => {
      state.sources = action.payload;
    });
});

export default statsReducer;
