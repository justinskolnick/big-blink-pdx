import { createAction, createReducer } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { Id } from '../types';

type Stat = {
  dataSourceId?: Id;
  id: Id;
  incidentId?: Id;
  label?: string;
  total: number;
};

type Stats = Stat[];

type StatsObject = {
  id: Id;
  stats: Stat[];
};

const setEntity = createAction<StatsObject>('stats/setEntity');
const setPerson = createAction<StatsObject>('stats/setPerson');
const setSources = createAction<Stats>('stats/setSources');

export const actions = {
  setEntity,
  setPerson,
  setSources,
};

interface InitialState {
  entities: StatsObject[];
  people: StatsObject[];
  sources: Stats;
}

const initialState: InitialState = {
  entities: [],
  people: [],
  sources: [],
};

const statsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setEntity, (state, action: PayloadAction<StatsObject>) => {
      state.entities.push(action.payload);
    })
    .addCase(setPerson, (state, action: PayloadAction<StatsObject>) => {
      state.people.push(action.payload);
    })
    .addCase(setSources, (state, action: PayloadAction<Stats>) => {
      state.sources = action.payload;
    });
});

export default statsReducer;
