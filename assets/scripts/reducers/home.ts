import { createAction, createReducer } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type HomeHeader = {
  intro: string;
  note: string;
};

type HomeOverview = {
  title: string;
  intro: string;
};

type Home = {
  header: HomeHeader;
  overview: HomeOverview;
};

const initialState = {
  header: {},
  overview: {},
} as Home;

const setHeader = createAction<HomeHeader>('api/setHeader');
const setOverview = createAction<HomeOverview>('api/setOverview');

export const actions = {
  setHeader,
  setOverview,
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setHeader, (state, action: PayloadAction<HomeHeader>) => {
      state.header = action.payload;
    })
    .addCase(setOverview, (state, action: PayloadAction<HomeOverview>) => {
      state.overview = action.payload;
    });
});

export default reducer;
