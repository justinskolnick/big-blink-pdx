import type { Person } from '../types';
import { MiddlewareHandlerFn } from '../types';

import { hasPernr, lookupOfficialPositionsForId } from './handle-set-person';

const handleSetPeople: MiddlewareHandlerFn = (store, action) => {
  const { payload } = action;

  const people = payload as Person[];

  const peopleWithPernr = people.filter(hasPernr);
  const ids = peopleWithPernr.map(person => person.id);

  lookupOfficialPositionsForId(store, ids);
};

export default handleSetPeople;
