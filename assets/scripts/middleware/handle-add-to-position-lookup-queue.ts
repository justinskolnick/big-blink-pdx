import { actions } from '../reducers/official-positions';
import api from '../services/api';

import type { Ids } from '../types';
import { MiddlewareHandlerFn } from '../types';

const handleAddToPositionLookupQueue: MiddlewareHandlerFn = async (store, action) => {
  const { dispatch } = store;
  const { payload } = action;
  const { endpoints } = api;

  const endpoint = endpoints.getPersonOfficialPositionsById;

  const ids = payload as Ids;

  await Promise.all(ids.map(async (id) => {
    const promise = dispatch(endpoint.initiate({ id }));
    const result = await promise;

    if (result.isSuccess) {
      dispatch(actions.addToLookupCompleted(result.originalArgs.id));
    }

    promise.unsubscribe();

    return result;
  }));
};

export default handleAddToPositionLookupQueue;
