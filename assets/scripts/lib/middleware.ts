import { createListenerMiddleware } from '@reduxjs/toolkit';

import handleAddToPositionLookupQueue from '../middleware/handle-add-to-position-lookup-queue';
import handleSetPeople from '../middleware/handle-set-people';
import handleSetPerson from '../middleware/handle-set-person';

import * as peopleActions from '../reducers/people';

import type { AppDispatch, RootState } from '../lib/store';

declare type ExtraArgument = null;

const listenerMiddleware = createListenerMiddleware();

export const startAppListening = listenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch,
  ExtraArgument
>();

startAppListening({
  actionCreator: peopleActions.addToLookupQueue,
  effect: handleAddToPositionLookupQueue,
});

startAppListening({
  actionCreator: peopleActions.set,
  effect: handleSetPerson,
});

startAppListening({
  actionCreator: peopleActions.setAll,
  effect: handleSetPeople,
});

export default listenerMiddleware;
