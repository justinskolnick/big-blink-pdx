import * as actions from '../reducers/people';

import { batchPromiseAll } from '../lib/async';
import api from '../services/api';

import type { Id, Ids } from '../types';
import { MiddlewareHandlerFn } from '../types';

const handleAddToPositionLookupQueue: MiddlewareHandlerFn = async (store, action) => {
  const { dispatch } = store;
  const { payload } = action;
  const { endpoints } = api;

  const endpoint = endpoints.getPersonOfficialPositionsById;

  const ids = payload as Ids;

  const method = async (id: Id) => {
    const promise = dispatch(endpoint.initiate({ id }));
    const result = await promise;

    if (result.isSuccess) {
      dispatch(actions.addToLookupCompleted(result.originalArgs.id));
    }

    promise.unsubscribe();

    return result;
  };

  try {
    await batchPromiseAll(ids, method);
  } catch (error) {
    console.error('Failed to fetch:', error.message); // eslint-disable-line no-console
  }
};

export default handleAddToPositionLookupQueue;
