import { isAnyOf } from '@reduxjs/toolkit';
import type { UnknownAction } from '@reduxjs/toolkit';
import type { Middleware } from 'redux';

import handleSetPeople from '../middleware/handle-set-people';
import handleSetPerson from '../middleware/handle-set-person';

import * as peopleActions from '../reducers/people';

import { MiddlewareHandlerFn } from '../types';

const isAllowed = isAnyOf(
  peopleActions.set,
  peopleActions.setAll,
);

const types = {
  'people/set': handleSetPerson,
  'people/setAll': handleSetPeople,
} as Record<string, MiddlewareHandlerFn>;

const handlers: Middleware = store => next => (action: UnknownAction) => {
  if (isAllowed(action) && action.type in types) {
    types[action.type](store, action);
  }

  return next(action);
};

export default handlers;
