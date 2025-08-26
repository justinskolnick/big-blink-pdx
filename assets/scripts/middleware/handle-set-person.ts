import type { Id, Ids, Person } from '../types';
import { MiddlewareHandlerFn } from '../types';

import { unique } from '../lib/array';

import * as actions from '../reducers/people';

import {
  getOfficialPositionsLookupCompleted,
  getOfficialPositionsLookupQueue,
} from '../selectors';

export const hasPernr = (person: Person) => person.pernr !== null;

export interface MiddlewareHandlerIdsFn {
  (store: any, idOrIds: Id | Ids): void;
}

export const lookupOfficialPositionsForId: MiddlewareHandlerIdsFn = (store, idOrIds) => {
  const { dispatch, getState } = store;

  const queue = getOfficialPositionsLookupQueue(getState());
  const completed = getOfficialPositionsLookupCompleted(getState());

  let ids = [] as Ids;

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

const handleSetPerson: MiddlewareHandlerFn = (store, action) => {
  const { payload } = action;

  const person = payload as Person;

  if (hasPernr(person)) {
    lookupOfficialPositionsForId(store, person.id);
  }
};

export default handleSetPerson;
