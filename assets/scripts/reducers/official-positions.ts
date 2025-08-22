import { createAction, createReducer } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { unique } from '../lib/array';

import type { Id, Ids } from '../types';

const addToLookupCompleted = createAction<Id>('officialPositions/addToLookupCompleted');
const addToLookupQueue = createAction<Ids>('officialPositions/addToLookupQueue');

export const actions = {
  addToLookupCompleted,
  addToLookupQueue,
};

const initialState = {
  completed: [] as Ids,
  queue: [] as Ids,
};

const officialPositionsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addToLookupCompleted, (state, action: PayloadAction<Id>) => {
      state.queue = state.queue.filter(id => id !== action.payload);
      state.completed.push(action.payload);
    })
    .addCase(addToLookupQueue, (state, action: PayloadAction<Ids>) => {
      state.queue = unique([].concat(state.queue, action.payload));
    });
});

export default officialPositionsReducer;
