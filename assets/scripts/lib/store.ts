import { configureStore } from '@reduxjs/toolkit';

import handlers from './middleware';

import api from '../services/api';
import entities from '../reducers/entities';
import incidents from '../reducers/incidents';
import leaderboard from '../reducers/leaderboard';
import officialPositions from '../reducers/official-positions';
import people from '../reducers/people';
import sources from '../reducers/sources';
import stats from '../reducers/stats';
import ui from '../reducers/ui';

export const store = configureStore({
  reducer: {
    api: api.reducer,
    entities,
    incidents,
    leaderboard,
    officialPositions,
    people,
    sources,
    stats,
    ui,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware, handlers),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
