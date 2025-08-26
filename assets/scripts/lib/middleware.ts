import type { UnknownAction } from '@reduxjs/toolkit';
import type { Middleware } from 'redux';

import handleAddToPositionLookupQueue from '../middleware/handle-add-to-position-lookup-queue';
import handleSetPeople from '../middleware/handle-set-people';
import handleSetPerson from '../middleware/handle-set-person';

import * as peopleActions from '../reducers/people';

import { MiddlewareHandlerFn } from '../types';

const types = {
  [peopleActions.addToLookupQueue.type]: handleAddToPositionLookupQueue,
  [peopleActions.set.type]: handleSetPerson,
  [peopleActions.setAll.type]: handleSetPeople,
} as Record<string, MiddlewareHandlerFn>;

const handlers: Middleware = store => next => (action: UnknownAction) => {
  if (action.type in types) {
    types[action.type](store, action);
  }

  return next(action);
};

export default handlers;
