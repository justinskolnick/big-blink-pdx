import type { PayloadAction } from '@reduxjs/toolkit';

import { batchPromiseAll } from '../lib/async';
import type { ListenerAPI } from '../lib/store';

import * as actions from '../reducers/people';

import api from '../services/api';

import type { Id, Ids } from '../types';

const handleAddToPositionLookupQueue = async (action: PayloadAction<Ids>, state: ListenerAPI) => {
  const { dispatch } = state;
  const { payload } = action;
  const { endpoints } = api;

  const endpoint = endpoints.getPersonOfficialPositionsById;

  const method = async (id: Id) => {
    const promise = dispatch(endpoint.initiate({ id }));
    const result = await promise;

    if (result.isSuccess) {
      if (result.originalArgs.id) {
        dispatch(actions.addToLookupCompleted(result.originalArgs.id));
      }
    }

    promise.unsubscribe();

    return result;
  };

  try {
    await batchPromiseAll(payload, method);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Failed to fetch:', error.message); // eslint-disable-line no-console
    }
  }
};

export default handleAddToPositionLookupQueue;
