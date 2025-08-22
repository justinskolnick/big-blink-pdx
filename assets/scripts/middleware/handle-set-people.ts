import type { Person } from '../types';
import { MiddlewareHandlerFn } from '../types';

import { hasPernr, lookupOfficialPositions } from './handle-set-person';

const handleSetPeople: MiddlewareHandlerFn = (store, action) => {
  const { payload } = action;
  const people = payload as Person[];

  const peopleWithPernr = people.filter(hasPernr);

  peopleWithPernr.forEach(person => {
    lookupOfficialPositions(person);
  });
};

export default handleSetPeople;
