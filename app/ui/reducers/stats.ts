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

type StatsObject = {
  id: Id;
  stats: Stat[];
};

const setEntity = createAction('stats/setEntity');
const setPerson = createAction('stats/setPerson');
const setSources = createAction('stats/setSources');

export const actions = {
  setEntity,
  setPerson,
  setSources,
};

const initialState = {
  entities: [] as StatsObject[],
  people: [] as StatsObject[],
  sources: [] as Stat[],
};

const statsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setSources, (state, action: PayloadAction<Stat[]>) => {
      state.sources = action.payload;
    })
    .addCase(setEntity, (state, action: PayloadAction<StatsObject>) => {
      state.entities.push(action.payload);
    })
    .addCase(setPerson, (state, action: PayloadAction<StatsObject>) => {
      state.people.push(action.payload);
    });
});

export default statsReducer;
