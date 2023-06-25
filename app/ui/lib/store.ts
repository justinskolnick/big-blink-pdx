import { configureStore } from '@reduxjs/toolkit';

import entities from '../reducers/entities';
import incidents from '../reducers/incidents';
import people from '../reducers/people';
import sources from '../reducers/sources';
import stats from '../reducers/stats';
import ui from '../reducers/ui';

export const store = configureStore({
  reducer: {
    entities,
    incidents,
    people,
    sources,
    stats,
    ui,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
