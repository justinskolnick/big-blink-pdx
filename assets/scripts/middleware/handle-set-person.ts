import type { PayloadAction } from '@reduxjs/toolkit';

import type { ListenerAPI } from '../lib/store';

import { unique } from '../lib/array';

import * as actions from '../reducers/people';

import {
  getOfficialPositionsLookupCompleted,
  getOfficialPositionsLookupQueue,
} from '../selectors';

import type { Id, Ids, PersonObject } from '../types';

export const hasPernr = (person: PersonObject) => person.pernr !== null;

export interface LookupIdsFn {
  (state: ListenerAPI, idOrIds: Id | Ids): void;
}

export const lookupOfficialPositionsForId: LookupIdsFn = (state, idOrIds) => {
  const { dispatch, getState } = state;

  const queue = getOfficialPositionsLookupQueue(getState());
  const completed = getOfficialPositionsLookupCompleted(getState());

  let ids: Ids = [];

  if (Array.isArray(idOrIds)) {
    ids = unique(idOrIds.filter(id => !queue.includes(id) && !completed.includes(id)));
  } else if (Number.isInteger(idOrIds)) {
    if (!queue.includes(idOrIds) && !completed.includes(idOrIds)) {
      ids.push(idOrIds);
    }
  }

  if (ids.length) {
    dispatch(actions.addToLookupQueue(ids));
  }
};

const handleSetPerson = (action: PayloadAction<PersonObject>, state: ListenerAPI) => {
  const { payload } = action;

  if (hasPernr(payload)) {
    lookupOfficialPositionsForId(state, payload.id);
  }
};

export default handleSetPerson;
